import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock, CheckCircle, User } from "lucide-react";
import services from "../data/services";
import doctor from "../assets/doctor.jpg";
import pageBg from "../assets/page-bg.png";

function BookAppointment() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM",
  ];

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
            Schedule a Visit
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-white leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Book Appointment
          </h1>
            </div>
          </section>
    

    

      {/* ── APPOINTMENT FORM ── */}
      <section className="bg-[#f8f8f6] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Schedule Your Visit
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Book an Appointment
            </h2>
            <p className="text-[#666] text-base font-light max-w-xl mx-auto">
              Fill out the form below and our team will confirm your appointment within 24 hours.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-[#e8e8e8] p-8 md:p-12">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={36} strokeWidth={1.2} className="text-[#4A7E96]" />
                  </div>
                  <h3 className="text-3xl font-light text-[#1a1a1a] mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Appointment Requested!
                  </h3>
                  <p className="text-[#666] text-base font-light mb-2 max-w-md mx-auto">
                    Thank you, <strong>{formData.firstName}</strong>. We have received your appointment request and will confirm your booking within 24 hours.
                  </p>
                  <p className="text-[#888] text-sm font-light mb-8">
                    A confirmation will be sent to <strong>{formData.email}</strong>
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ firstName: "", lastName: "", email: "", phone: "", service: "", date: "", time: "", message: "" }); }}
                      className="border border-[#4A7E96] text-[#4A7E96] px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#4A7E96] hover:text-white transition-all duration-300"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Book Another
                    </button>
                    <Link to="/"
                      className="bg-[#4A7E96] text-white px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] transition-all duration-300"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Back to Home
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-5 pb-3 border-b border-[#e8e8e8]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          First Name *
                        </label>
                        <input
                          type="text" name="firstName" value={formData.firstName}
                          onChange={handleChange} required placeholder="Adaeze"
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          Last Name *
                        </label>
                        <input
                          type="text" name="lastName" value={formData.lastName}
                          onChange={handleChange} required placeholder="Okonkwo"
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          Email Address *
                        </label>
                        <input
                          type="email" name="email" value={formData.email}
                          onChange={handleChange} required placeholder="adaeze@email.com"
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          Phone Number *
                        </label>
                        <input
                          type="tel" name="phone" value={formData.phone}
                          onChange={handleChange} required placeholder="+234 800 000 0000"
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-5 pb-3 border-b border-[#e8e8e8]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Appointment Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          Service Required *
                        </label>
                        <select
                          name="service" value={formData.service}
                          onChange={handleChange} required
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200 bg-white">
                          <option value="">Select a service</option>
                          {services.map((s) => (
                            <option key={s.id} value={s.title}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          Preferred Date *
                        </label>
                        <input
                          type="date" name="date" value={formData.date}
                          onChange={handleChange} required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          Preferred Time *
                        </label>
                        <select
                          name="time" value={formData.time}
                          onChange={handleChange} required
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200 bg-white">
                          <option value="">Select a time</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                          Additional Notes
                        </label>
                        <textarea
                          name="message" value={formData.message}
                          onChange={handleChange} rows={4}
                          placeholder="Tell us about any specific concerns, symptoms, or questions you have..."
                          className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="bg-[#4A7E96]/5 border border-[#4A7E96]/20 px-6 py-4 flex items-start gap-3">
                    <CheckCircle size={16} strokeWidth={1.5} className="text-[#4A7E96] shrink-0 mt-0.5" />
                    <p className="text-[#555] text-xs leading-relaxed">
                      By submitting this form, you consent to being contacted by Hopeville Eye Clinic to confirm your appointment. We will never share your information with third parties.
                    </p>
                  </div>

                  <button type="submit"
                    className="bg-[#4A7E96] text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#B5685A] transition-all duration-300 w-full"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Request Appointment
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

  {/* ── LEAD DOCTOR ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              The Heart of Our Clinic
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Meet Your Doctor
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto">

            {/* Photo */}
            <div className="relative">
              <div className="aspect-[3/4] bg-[#4A7E96]/8 flex items-center justify-center relative overflow-hidden">
                <div className="flex flex-col items-center gap-4">
                  <img src={doctor} alt="Dr. Ezinne Ihekweaba" className="w-full h-full object-cover object-top" />
                </div>
                
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-[#B5685A]/10 -z-10" />
              <div className="absolute top-5 left-5 border border-[#4A7E96]/20 w-full h-full -z-10" />
            </div>

            {/* Info */}
            <div>
              <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Medical Director
              </p>
              <h3 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Dr. Ezinne Ihekweaba
              </h3>
              <p className="text-[#4A7E96] text-sm tracking-[0.1em] uppercase mb-6 font-medium">
                Consultant Optometrist
              </p>

              <div className="h-[1px] bg-[#e8e8e8] mb-6" />

              <p className="text-[#555] text-base md:text-lg leading-relaxed font-light mb-6">
                Dr. Ezinne Ihekweaba is the driving force behind Hopeville Eye Clinic's commitment to excellence. As Medical Director and Consultant Optometrist, she brings years of specialized expertise in comprehensive eye care, combining clinical precision with a deeply personal approach to patient wellbeing.
              </p>
              <p className="text-[#555] text-base leading-relaxed font-light mb-8">
                Under her leadership, Hopeville Eye Clinic has grown into Port Harcourt's most trusted destination for both clinical eye care and luxury optical services — a testament to her vision for what modern eye care should look like.
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {[
                  "Consultant Optometrist with advanced clinical training",
                  "Specialist in comprehensive eye health diagnostics",
                  "Passionate advocate for preventive vision care",
                  "Leader in luxury eyewear consultancy",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-[#4A7E96] shrink-0 mt-1" strokeWidth={1.5} />
                    <span className="text-[#555] text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-3 border-t border-[#e8e8e8] pt-6">
                <a href="tel:+2348135500578"
                  className="flex items-center gap-3 text-[#555] text-sm hover:text-[#4A7E96] transition-colors duration-200">
                  <Phone size={15} strokeWidth={1.5} className="text-[#4A7E96]" />
                  +234 813 550 0578
                </a>
                <a href="mailto:Hopevilleeyeclinicltd@gmail.com"
                  className="flex items-center gap-3 text-[#555] text-sm hover:text-[#4A7E96] transition-colors duration-200">
                  <Mail size={15} strokeWidth={1.5} className="text-[#4A7E96]" />
                  Hopevilleeyeclinicltd@gmail.com
                </a>
                <div className="flex items-start gap-3 text-[#555] text-sm">
                  <Clock size={15} strokeWidth={1.5} className="text-[#4A7E96] shrink-0 mt-0.5" />
                  <div>
                    <p>Mon – Fri: 8:00 AM – 5:30 PM</p>
                    <p>Saturday: 10:00 AM – 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default BookAppointment;