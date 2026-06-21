import { useEffect, useRef, useState } from "react";
import { X, Camera, RotateCcw } from "lucide-react";


function TryOn({ product, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [faceMesh, setFaceMesh] = useState(null);

  useEffect(() => {
    startCamera();
    loadFaceMesh();
    return () => cleanup();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera access to use this feature.");
      setLoading(false);
    }
  }

  async function loadFaceMesh() {
    try {
      const { FaceMesh } = await import("@mediapipe/face_mesh");

      const mesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      mesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      mesh.onResults((results) => {
        drawOverlay(results);
      });

      setFaceMesh(mesh);
      setLoading(false);
      runDetection(mesh);
    } catch (err) {
      setError("Failed to load face detection. Please try again.");
      setLoading(false);
    }
  }

  function runDetection(mesh) {
    async function detect() {
      if (videoRef.current && videoRef.current.readyState === 4) {
        await mesh.send({ image: videoRef.current });
      }
      animationRef.current = requestAnimationFrame(detect);
    }
    detect();
  }

  function drawOverlay(results) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror the video
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (!results.multiFaceLandmarks?.length) return;

    const landmarks = results.multiFaceLandmarks[0];
    const W = canvas.width;
    const H = canvas.height;

    // Key landmarks
    // Left eye outer: 33, inner: 133
    // Right eye outer: 362, inner: 263
    // Nose bridge: 168
    // Left temple: 234, Right temple: 454

    const leftTemple = landmarks[234];
    const rightTemple = landmarks[454];
    const noseBridge = landmarks[168];
    const leftEyeOuter = landmarks[33];
    const rightEyeOuter = landmarks[263];

    // Mirror x coordinates
    const mirrorX = (x) => 1 - x;

    const lx = mirrorX(leftTemple.x) * W;
    const rx = mirrorX(rightTemple.x) * W;
    const ny = noseBridge.y * H;
    const ley = leftEyeOuter.y * H;
    const rey = rightEyeOuter.y * H;

    const glassesWidth = Math.abs(rx - lx) * 1.1;
    const glassesHeight = glassesWidth * 0.42;
    const glassesX = Math.min(lx, rx) - glassesWidth * 0.05;
    const glassesY = ((ley + rey) / 2) - glassesHeight * 0.4;

    // Draw glasses overlay
    drawGlasses(ctx, glassesX, glassesY, glassesWidth, glassesHeight, product);
  }

  function drawGlasses(ctx, x, y, w, h, product) {
    const frameColor = product.colors[0]?.hex || "#1a1a1a";
    const lensColor = "rgba(0, 0, 0, 0.25)";
    const halfW = w / 2;
    const lensW = halfW * 0.88;
    const lensH = h * 0.85;
    const bridgeY = y + h * 0.5;

    ctx.save();
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = w * 0.025;
    ctx.fillStyle = lensColor;

    // Left lens
    const lx = x;
    const ly = y;

    if (product.shape === "Cat Eye") {
      ctx.beginPath();
      ctx.moveTo(lx, ly + lensH * 0.4);
      ctx.quadraticCurveTo(lx, ly, lx + lensW * 0.3, ly - lensH * 0.1);
      ctx.quadraticCurveTo(lx + lensW * 0.7, ly - lensH * 0.15, lx + lensW, ly + lensH * 0.1);
      ctx.quadraticCurveTo(lx + lensW, ly + lensH, lx + lensW * 0.5, ly + lensH);
      ctx.quadraticCurveTo(lx, ly + lensH, lx, ly + lensH * 0.4);
      ctx.fill();
      ctx.stroke();
    } else if (product.shape === "Round") {
      ctx.beginPath();
      ctx.ellipse(lx + lensW / 2, ly + lensH / 2, lensW / 2, lensH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (product.shape === "Aviator") {
      ctx.beginPath();
      ctx.moveTo(lx + lensW * 0.1, ly);
      ctx.lineTo(lx + lensW * 0.9, ly);
      ctx.quadraticCurveTo(lx + lensW, ly, lx + lensW, ly + lensH * 0.2);
      ctx.quadraticCurveTo(lx + lensW * 1.05, ly + lensH * 0.8, lx + lensW * 0.5, ly + lensH);
      ctx.quadraticCurveTo(lx - lensW * 0.05, ly + lensH * 0.8, lx, ly + lensH * 0.2);
      ctx.quadraticCurveTo(lx, ly, lx + lensW * 0.1, ly);
      ctx.fill();
      ctx.stroke();
    } else {
      // Rectangle default
      const radius = lensH * 0.12;
      ctx.beginPath();
      ctx.moveTo(lx + radius, ly);
      ctx.lineTo(lx + lensW - radius, ly);
      ctx.quadraticCurveTo(lx + lensW, ly, lx + lensW, ly + radius);
      ctx.lineTo(lx + lensW, ly + lensH - radius);
      ctx.quadraticCurveTo(lx + lensW, ly + lensH, lx + lensW - radius, ly + lensH);
      ctx.lineTo(lx + radius, ly + lensH);
      ctx.quadraticCurveTo(lx, ly + lensH, lx, ly + lensH - radius);
      ctx.lineTo(lx, ly + radius);
      ctx.quadraticCurveTo(lx, ly, lx + radius, ly);
      ctx.fill();
      ctx.stroke();
    }

    // Right lens
    const rx = x + halfW + w * 0.02;
    const ry = y;

    if (product.shape === "Cat Eye") {
      ctx.beginPath();
      ctx.moveTo(rx, ry + lensH * 0.4);
      ctx.quadraticCurveTo(rx, ry, rx + lensW * 0.3, ry - lensH * 0.15);
      ctx.quadraticCurveTo(rx + lensW * 0.7, ry - lensH * 0.1, rx + lensW, ry + lensH * 0.4);
      ctx.quadraticCurveTo(rx + lensW, ry + lensH, rx + lensW * 0.5, ry + lensH);
      ctx.quadraticCurveTo(rx, ry + lensH, rx, ry + lensH * 0.4);
      ctx.fill();
      ctx.stroke();
    } else if (product.shape === "Round") {
      ctx.beginPath();
      ctx.ellipse(rx + lensW / 2, ry + lensH / 2, lensW / 2, lensH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (product.shape === "Aviator") {
      ctx.beginPath();
      ctx.moveTo(rx + lensW * 0.1, ry);
      ctx.lineTo(rx + lensW * 0.9, ry);
      ctx.quadraticCurveTo(rx + lensW, ry, rx + lensW, ry + lensH * 0.2);
      ctx.quadraticCurveTo(rx + lensW * 1.05, ry + lensH * 0.8, rx + lensW * 0.5, ry + lensH);
      ctx.quadraticCurveTo(rx - lensW * 0.05, ry + lensH * 0.8, rx, ry + lensH * 0.2);
      ctx.quadraticCurveTo(rx, ry, rx + lensW * 0.1, ry);
      ctx.fill();
      ctx.stroke();
    } else {
      const radius = lensH * 0.12;
      ctx.beginPath();
      ctx.moveTo(rx + radius, ry);
      ctx.lineTo(rx + lensW - radius, ry);
      ctx.quadraticCurveTo(rx + lensW, ry, rx + lensW, ry + radius);
      ctx.lineTo(rx + lensW, ry + lensH - radius);
      ctx.quadraticCurveTo(rx + lensW, ry + lensH, rx + lensW - radius, ry + lensH);
      ctx.lineTo(rx + radius, ry + lensH);
      ctx.quadraticCurveTo(rx, ry + lensH, rx, ry + lensH - radius);
      ctx.lineTo(rx, ry + radius);
      ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
      ctx.fill();
      ctx.stroke();
    }

    // Bridge
    ctx.beginPath();
    ctx.moveTo(lx + lensW, bridgeY);
    ctx.quadraticCurveTo(x + halfW, bridgeY - h * 0.1, rx, bridgeY);
    ctx.stroke();

    // Left temple
    ctx.beginPath();
    ctx.moveTo(lx, bridgeY);
    ctx.lineTo(lx - w * 0.12, bridgeY - h * 0.05);
    ctx.stroke();

    // Right temple
    ctx.beginPath();
    ctx.moveTo(rx + lensW, bridgeY);
    ctx.lineTo(rx + lensW + w * 0.12, bridgeY - h * 0.05);
    ctx.stroke();

    // Lens shine
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    if (product.shape === "Round") {
      ctx.beginPath();
      ctx.ellipse(lx + lensW * 0.35, ly + lensH * 0.3, lensW * 0.15, lensH * 0.1, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(rx + lensW * 0.35, ry + lensH * 0.3, lensW * 0.15, lensH * 0.1, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(lx + lensW * 0.3, ly + lensH * 0.25, lensW * 0.18, lensH * 0.08, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(rx + lensW * 0.3, ry + lensH * 0.25, lensW * 0.18, lensH * 0.08, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function cleanup() {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }

  function handleClose() {
    cleanup();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
          <div>
            <p className="text-[#B5685A] text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Live Try-On
            </p>
            <h3 className="text-xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {product.name}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center border border-[#e8e8e8] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200">
            <X size={18} />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative bg-[#0d1f2d] aspect-video">
          {/* Hidden video element */}
          <video
            ref={videoRef}
            className="hidden"
            playsInline
            muted
          />

          {/* Canvas shows mirrored video + glasses overlay */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />

          {/* Loading state */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-[#4A7E96] rounded-full animate-spin" />
              <p className="text-white/60 text-sm font-light">
                Loading face detection...
              </p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
              <Camera size={40} strokeWidth={1} className="text-white/30" />
              <p className="text-white/70 text-sm font-light leading-relaxed">{error}</p>
            </div>
          )}

          {/* Face guide overlay */}
          {!loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-64 border-2 border-white/20 rounded-full" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#e8e8e8]">
          <p className="text-[#888] text-xs font-light">
            Position your face within the oval guide
          </p>
          <div className="flex items-center gap-2 text-xs text-[#4A7E96]">
            <div className="w-2 h-2 rounded-full bg-[#4A7E96] animate-pulse" />
            Live
          </div>
        </div>
      </div>
    </div>
  );
}

export default TryOn;