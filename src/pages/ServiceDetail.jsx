import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";
import services from "../data/services";
import serviceBg from "../assets/service-bg.jpg";

function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);

  // Other services to suggest
  const otherServices = services.filter(s => s.slug !== slug).slice(0, 3);

  if (!service) {
    return (
      <main className="bg-white min-h-screen pt-40 text-center px-4">
        <h1 className="text-3xl font-light text-[#1a1a1a] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Service Not Found
        </h1>
        <Link to="/services" className="text-[#4A7E96] text-sm underline">
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-white">

      {/* ── HERO ── */}
    <section className="relative min-h-[60vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={serviceBg}
          alt="Hopeville Eye Clinic"
          className="w-full h-full object-cover object-center"
        />
    
        <div className="absolute inset-0 bg-black/35" />
      </div>
    
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-5" />
    
      <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full border border-[#4A7E96]/20 translate-x-1/3 -translate-y-1/4" />
    
      <div className="absolute right-24 top-12 w-[350px] h-[350px] rounded-full border border-[#B5685A]/10 translate-x-1/3" />
    
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-40 relative z-10 w-full">
          <h1 className="text-3xl md:text-5xl font-light text-white leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {service.title}
          </h1>
            </div>
    
    </section>

      {/* ── CONTENT ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-3 gap-12 md:gap-16">

          {/* Main Content */}
          <div className="md:col-span-2">
            <p className="text-[#444] text-base  leading-relaxed font-light mb-12">
              {service.heroDesc}
            </p>

            {service.details.map((detail, i) => (
              <div key={i} className="mb-10">
                <h2 className="text-2xl md:text-3xl font-light text-[#1a1a1a] mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {detail.heading}
                </h2>
                <div className="h-[2px] w-12 bg-[#4A7E96] mb-5" />
                <p className="text-[#555] text-base leading-relaxed font-light">
                  {detail.body}
                </p>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">

            {/* Benefits */}
            <div className="bg-[#f8f8f6] p-8 border border-[#e8e8e8]">
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Key Benefits
              </h3>
              <div className="flex flex-col gap-4">
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-[#4A7E96] shrink-0 mt-1" strokeWidth={1.5} />
                    <span className="text-[#555] text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book CTA */}
            <div className="bg-[#0d1f2d] p-8">
              <p className="text-[#B5685A] text-xs tracking-[0.2em] uppercase mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Ready to Begin?
              </p>
              <h3 className="text-xl font-light text-white mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Book This Service
              </h3>
              <p className="text-white/60 text-sm font-light mb-6 leading-relaxed">
                Schedule an appointment with our specialists today.
              </p>
              <Link to="/book"
                className="block text-center bg-[#4A7E96] text-white py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] transition-all duration-300 font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Book Appointment
              </Link>
            </div>

            {/* Contact */}
            <div className="border border-[#e8e8e8] p-8">
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Have Questions?
              </h3>
              <p className="text-[#666] text-sm font-light mb-4">
                Our team is happy to answer any questions about this service.
              </p>
              <a href="tel:+2348133300378"
                className="text-[#4A7E96] text-sm font-medium hover:text-[#B5685A] transition-colors">
                +234 813 330 0378
              </a>
            </div>
          </div>
        </div>
      </section>

     

    </main>
  );
}

export default ServiceDetail;