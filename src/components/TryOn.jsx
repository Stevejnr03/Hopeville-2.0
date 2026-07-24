import { useEffect, useRef, useState } from "react";
import { X, Camera, Download, RotateCcw } from "lucide-react";

function TryOn({ product, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const faceMeshRef = useRef(null);
  const glassesImgRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [glassesLoaded, setGlassesLoaded] = useState(false);

  const glassesImageUrl = product.tryonImage || product.images?.[0] || null;

  useEffect(() => {
    if (glassesImageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        glassesImgRef.current = img;
        setGlassesLoaded(true);
        console.log("✅ Glasses image loaded:", img.width, "x", img.height);
      };
      img.onerror = () => {
        console.error("❌ Failed to load glasses image");
        setGlassesLoaded(false);
      };
      img.src = glassesImageUrl;
    }
    init();
    return () => cleanup();
  }, []);

  async function init() {
    try {
      await startCamera();
      await loadMediaPipe();
    } catch (err) {
      console.error("Init error:", err);
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setStatus("nocamera");
      setErrorMsg("Camera access denied. Please allow camera access.");
      throw err;
    }
  }

  function loadMediaPipe() {
    return new Promise((resolve, reject) => {
      if (window.FaceMesh) {
        setupFaceMesh(resolve, reject);
        return;
      }

      const scripts = [
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js",
      ];

      function loadNext(index) {
        if (index >= scripts.length) {
          setTimeout(() => setupFaceMesh(resolve, reject), 500);
          return;
        }
        const existing = document.querySelector(
          `script[src="${scripts[index]}"]`,
        );
        if (existing) {
          loadNext(index + 1);
          return;
        }
        const script = document.createElement("script");
        script.src = scripts[index];
        script.crossOrigin = "anonymous";
        script.onload = () => loadNext(index + 1);
        script.onerror = () => {
          setStatus("error");
          setErrorMsg(
            "Failed to load face detection. Check your internet connection.",
          );
          reject(new Error(`Failed to load ${scripts[index]}`));
        };
        document.head.appendChild(script);
      }
      loadNext(0);
    });
  }

  function setupFaceMesh(resolve, reject) {
    try {
      if (!window.FaceMesh) {
        setStatus("error");
        setErrorMsg("Face detection not available. Please try again.");
        reject(new Error("FaceMesh not available"));
        return;
      }

      const faceMesh = new window.FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => drawOverlay(results));

      faceMesh
        .initialize()
        .then(() => {
          faceMeshRef.current = faceMesh;
          setStatus("ready");
          runDetection(faceMesh);
          resolve();
        })
        .catch((err) => {
          setStatus("error");
          setErrorMsg("Failed to initialize face detection. Please try again.");
          reject(err);
        });
    } catch (err) {
      setStatus("error");
      setErrorMsg("Failed to set up face detection. Please try again.");
      reject(err);
    }
  }

  function runDetection(mesh) {
    async function detect() {
      if (
        videoRef.current?.readyState === 4 &&
        videoRef.current?.videoWidth > 0
      ) {
        try {
          await mesh.send({ image: videoRef.current });
        } catch {}
      }
      animationRef.current = requestAnimationFrame(detect);
    }
    detect();
  }

  function drawOverlay(results) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !video.videoWidth) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // ✅ Draw mirrored video cleanly
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (!results.multiFaceLandmarks?.length) return;

    const landmarks = results.multiFaceLandmarks[0];
    const W = canvas.width;
    const H = canvas.height;

    // Key face landmarks
    const leftTemple = landmarks[234];
    const rightTemple = landmarks[454];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const noseTip = landmarks[4];
    const noseBridge = landmarks[168];

    const mirrorX = (x) => 1 - x;

    // Mirror the x coordinates
    const leftTempleX = mirrorX(leftTemple.x) * W;
    const rightTempleX = mirrorX(rightTemple.x) * W;
    const leftEyeY = leftEye.y * H;
    const rightEyeY = rightEye.y * H;
    const noseBridgeY = noseBridge.y * H;
    const noseTipY = noseTip.y * H;

    // ✅ Width spans temple to temple
     const faceWidth = Math.abs(rightTempleX - leftTempleX);

    // ✅ Height — proportional to face
     const glassesW = faceWidth * 1.3;
     const glassesH = glassesW * 1.0;

    // ✅ X — centered on face
    const centerX = (leftTempleX + rightTempleX) / 2;
    const glassesX = centerX - glassesW / 2;

    // ✅ Y — sit on the eyes, use eye mid point
    const eyeMidY = (leftEyeY + rightEyeY) / 2;
    const glassesY = eyeMidY - glassesH * 0.5;

    // ✅ Draw product image if loaded — NO blend mode, just draw it
    if (glassesImgRef.current && glassesLoaded) {
    drawProductImageOnCanvas(ctx, glassesX, glassesY, glassesW, glassesH);
  } else {
    drawCanvasGlasses(ctx, glassesX, glassesY, glassesW, glassesH, noseBridgeY);
  }
  }

  // ✅ Draw the actual product image — remove white bg using pixel filter
  function drawProductImageOnCanvas(ctx, x, y, w, h) {
    const img = glassesImgRef.current;
    if (!img) return;

    // ✅ Draw image to temp canvas, remove white pixels, draw result
    const temp = document.createElement("canvas");
    temp.width = img.width;
    temp.height = img.height;
    const tCtx = temp.getContext("2d");
    tCtx.drawImage(img, 0, 0);

    try {
      // Try to get pixel data — may fail if CORS blocked
      const imageData = tCtx.getImageData(0, 0, temp.width, temp.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // ✅ Remove white and near-white pixels
        if (r > 230 && g > 230 && b > 230) {
          data[i + 3] = 0; // fully transparent
        }
        // ✅ Soften light gray edges
        else if (r > 200 && g > 200 && b > 200) {
          const whiteness = Math.min(r, g, b);
          data[i + 3] = Math.round(255 - (whiteness - 200) * (255 / 55));
        }
      }

      tCtx.putImageData(imageData, 0, 0);

      // ✅ Draw processed image onto main canvas — no blend mode needed
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.drawImage(temp, x, y, w, h);
      ctx.restore();
    } catch (corsErr) {
      // ✅ CORS blocked getImageData — draw image directly with screen blend mode
      // This at least shows the glasses shape even if white bg shows
      console.warn("CORS blocked pixel access, drawing directly");
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img, x, y, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  function drawCanvasGlasses(ctx, x, y, w, h, bridgeY) {
    const frameColor = product.colors?.[0]?.hex || "#2a2a2a";
    const lensColor = "rgba(20, 20, 40, 0.2)";
    const halfW = w / 2;
    const lensW = halfW * 0.88;
    const lensH = h * 0.9;
    const shape = product.shape || "Rectangle";

    ctx.save();
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = Math.max(2.5, w * 0.02);

    function drawLens(lx, ly) {
      ctx.fillStyle = lensColor;
      ctx.beginPath();
      if (shape === "Round") {
        ctx.ellipse(
          lx + lensW / 2,
          ly + lensH / 2,
          lensW / 2,
          lensH / 2,
          0,
          0,
          Math.PI * 2,
        );
      } else if (shape === "Cat Eye") {
        ctx.moveTo(lx, ly + lensH * 0.4);
        ctx.quadraticCurveTo(lx, ly, lx + lensW * 0.3, ly - lensH * 0.1);
        ctx.quadraticCurveTo(
          lx + lensW * 0.7,
          ly - lensH * 0.15,
          lx + lensW,
          ly + lensH * 0.1,
        );
        ctx.quadraticCurveTo(
          lx + lensW,
          ly + lensH,
          lx + lensW * 0.5,
          ly + lensH,
        );
        ctx.quadraticCurveTo(lx, ly + lensH, lx, ly + lensH * 0.4);
      } else if (shape === "Aviator") {
        ctx.moveTo(lx + lensW * 0.1, ly);
        ctx.lineTo(lx + lensW * 0.9, ly);
        ctx.quadraticCurveTo(lx + lensW, ly, lx + lensW, ly + lensH * 0.2);
        ctx.quadraticCurveTo(
          lx + lensW * 1.05,
          ly + lensH * 0.8,
          lx + lensW * 0.5,
          ly + lensH,
        );
        ctx.quadraticCurveTo(
          lx - lensW * 0.05,
          ly + lensH * 0.8,
          lx,
          ly + lensH * 0.2,
        );
        ctx.quadraticCurveTo(lx, ly, lx + lensW * 0.1, ly);
      } else {
        const r = lensH * 0.15;
        ctx.moveTo(lx + r, ly);
        ctx.lineTo(lx + lensW - r, ly);
        ctx.quadraticCurveTo(lx + lensW, ly, lx + lensW, ly + r);
        ctx.lineTo(lx + lensW, ly + lensH - r);
        ctx.quadraticCurveTo(
          lx + lensW,
          ly + lensH,
          lx + lensW - r,
          ly + lensH,
        );
        ctx.lineTo(lx + r, ly + lensH);
        ctx.quadraticCurveTo(lx, ly + lensH, lx, ly + lensH - r);
        ctx.lineTo(lx, ly + r);
        ctx.quadraticCurveTo(lx, ly, lx + r, ly);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Shine highlight
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.ellipse(
        lx + lensW * 0.28,
        ly + lensH * 0.27,
        lensW * 0.15,
        lensH * 0.07,
        -0.3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    const rightX = x + halfW + w * 0.02;
    drawLens(x, y);
    drawLens(rightX, y);

    // Bridge
    ctx.beginPath();
    ctx.moveTo(x + lensW, bridgeY);
    ctx.quadraticCurveTo(
      (x + lensW + rightX) / 2,
      bridgeY - h * 0.08,
      rightX,
      bridgeY,
    );
    ctx.stroke();

    // Temple arms
    ctx.beginPath();
    ctx.moveTo(x, y + lensH * 0.4);
    ctx.lineTo(x - w * 0.12, y + lensH * 0.35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightX + lensW, y + lensH * 0.4);
    ctx.lineTo(rightX + lensW + w * 0.12, y + lensH * 0.35);
    ctx.stroke();

    ctx.restore();
  }

  function capturePhoto() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedPhoto(dataUrl);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }

  function retakePhoto() {
    setCapturedPhoto(null);
    if (faceMeshRef.current) runDetection(faceMeshRef.current);
  }

  function downloadPhoto() {
    if (!capturedPhoto) return;
    const link = document.createElement("a");
    link.href = capturedPhoto;
    link.download = `hopeville-tryon-${product.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.click();
  }

  function cleanup() {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current)
      streamRef.current.getTracks().forEach((t) => t.stop());
    if (faceMeshRef.current) {
      try {
        faceMeshRef.current.close();
      } catch {}
    }
  }

  function handleClose() {
    cleanup();
    onClose();
  }

  async function handleRetry() {
    setStatus("loading");
    setErrorMsg("");
    setCapturedPhoto(null);
    cleanup();
    await init();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-3">
            {product.images?.[0] && (
              <div className="w-12 h-12 bg-[#f8f8f6] overflow-hidden shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <p
                className="text-[#B5685A] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Live Try-On
              </p>
              <h3
                className="text-lg font-light text-[#1a1a1a]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.name}
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center border border-[#e8e8e8] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera */}
        <div className="relative bg-[#0d1f2d] aspect-video">
          <video ref={videoRef} className="hidden" playsInline muted />

          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
          )}

          {status === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-[#4A7E96] rounded-full animate-spin" />
              <p className="text-white/60 text-sm font-light">
                Loading face detection...
              </p>
              <p className="text-white/30 text-xs">
                This may take a few seconds
              </p>
            </div>
          )}

          {(status === "error" || status === "nocamera") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
              <Camera size={44} strokeWidth={1} className="text-white/25" />
              <p className="text-white/70 text-sm font-light leading-relaxed max-w-xs">
                {errorMsg}
              </p>
              {status === "error" && (
                <button
                  onClick={handleRetry}
                  className="border border-white/30 text-white/70 hover:border-white hover:text-white px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {status === "ready" && !capturedPhoto && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-44 h-60 border border-white/20 rounded-full" />
            </div>
          )}

          {status === "ready" && !capturedPhoto && (
            <div className="absolute bottom-5 inset-x-0 flex justify-center">
              <button
                onClick={capturePhoto}
                className="flex items-center gap-2 bg-white text-[#1a1a1a] px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] hover:text-white transition-all duration-300 shadow-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <Camera size={15} strokeWidth={1.5} />
                Capture Photo
              </button>
            </div>
          )}

          {capturedPhoto && (
            <div className="absolute bottom-5 inset-x-0 flex justify-center gap-3">
              <button
                onClick={retakePhoto}
                className="flex items-center gap-2 bg-white/90 text-[#1a1a1a] px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-white transition-all shadow-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <RotateCcw size={13} strokeWidth={1.5} />
                Retake
              </button>
              <button
                onClick={downloadPhoto}
                className="flex items-center gap-2 bg-[#4A7E96] text-white px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#1a1a1a] transition-all shadow-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <Download size={13} strokeWidth={1.5} />
                Save Photo
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#e8e8e8]">
          <p className="text-[#888] text-xs font-light">
            {capturedPhoto
              ? "Photo captured! Save it or retake."
              : status === "ready"
                ? "Position your face within the oval, then capture"
                : status === "loading"
                  ? "Please wait while we load face detection..."
                  : "Face detection unavailable"}
          </p>
          {status === "ready" && !capturedPhoto && (
            <div className="flex items-center gap-2 text-xs text-[#4A7E96]">
              <div className="w-2 h-2 rounded-full bg-[#4A7E96] animate-pulse" />
              Live
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TryOn;
