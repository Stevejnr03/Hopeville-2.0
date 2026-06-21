import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import services from "../data/services";
import ServiceIcon from "../components/ServiceIcon";
import pageBg from "../assets/page-bg.png";


function Services() {
  return (
    <main className="bg-white">

     {/* ── HERO ── */}
    <section className="relative min-h-[60vh] flex items-end overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src={pageBg}
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
          <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            What we offer
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-white leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Our Services
          </h1>
        </div>

</section>

      {/* ── INTRO ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center max-w-3xl mx-auto">
          <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Comprehensive Eye Care
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Everything Your Eyes Need, Under One Roof
          </h2>
          <p className="text-[#666] text-base md:text-lg leading-relaxed font-light">
            From routine eye examinations to specialized clinical care and luxury eyewear, Hopeville Eye Clinic offers a complete range of vision services delivered with clinical excellence and a patient-first approach.
          </p>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="bg-[#f8f8f6] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id}
                className="bg-white border border-[#e8e8e8] p-8 md:p-10 hover:border-[#4A7E96] hover:shadow-lg transition-all duration-300 group flex flex-col">
                <span className="text-4xl mb-6 block"><ServiceIcon slug={service.slug} size={40} color="#4A7E96" /></span>
                <h3 className="text-xl md:text-2xl font-medium text-[#1a1a1a] mb-4 group-hover:text-[#4A7E96] transition-colors duration-200"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {service.title}
                </h3>
                <p className="text-[#666] text-sm md:text-base leading-relaxed font-light mb-8 flex-1">
                  {service.shortDesc}
                </p>
                <Link
                  to={`/services/${service.slug}`}
                  className="flex items-center gap-2 text-[#4A7E96] text-sm tracking-[0.1em] uppercase font-medium hover:text-[#B5685A] transition-colors duration-200 group/link"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Read More
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0d1f2d] py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Get Started?
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Book Your Appointment Today
          </h2>
          <p className="text-white/70 text-base md:text-lg font-light mb-10 max-w-xl mx-auto">
            Our specialists are ready to provide you with the highest standard of eye care. Schedule your visit today.
          </p>
          <Link to="/book"
            className="bg-[#4A7E96] text-white px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] transition-all duration-300 font-medium inline-block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Book Appointment
          </Link>
        </div>
      </section>

    </main>
  );
}

export default Services;