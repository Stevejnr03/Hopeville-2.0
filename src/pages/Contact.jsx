import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import pageBg from "../assets/page-bg.png";
import contactImg from "../assets/contact.jpg";
import { contactDetails, faqs } from "../data/contact";

function Contact() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("http://localhost:5000/api/contact" || `${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSendAnother() {
    setSubmitSuccess(false);
    setSubmitError("");
  }

  return (
    <main className="bg-white">
      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={pageBg}
            alt="Hopeville Eye Clinic"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full border border-[#4A7E96]/20 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute right-24 top-12 w-[350px] h-[350px] rounded-full border border-[#B5685A]/10 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-40 relative z-10 w-full">
          <h1
            className="text-4xl md:text-6xl font-light text-white leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Reach Out to Us
          </h1>
        </div>
      </section>

      {/* ── CONTACT DETAILS ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <div
                  key={detail.title}
                  className="border border-[#e8e8e8] p-8 hover:border-[#4A7E96] hover:shadow-md transition-all duration-300 group"
                >
                  <div className="text-[#4A7E96] mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-lg font-medium text-[#1a1a1a] mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {detail.title}
                  </h3>
                  {detail.lines.map((line, i) => (
                    <p
                      key={i}
                      className="text-[#666] text-sm font-light leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section className="bg-[#f8f8f6] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p
              className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Send A Message
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              How Can We Help You?
            </h2>
            <p className="text-[#666] text-base leading-relaxed mb-8 font-light">
              Have a question about our services, eyewear collection, or want to
              learn more about what we offer? Fill out the form and our team
              will get back to you within 24 hours.
            </p>
            <div className="hidden md:block w-full h-64 bg-[#4A7E96]/8 relative">
              <div className="absolute inset-4 border border-[#4A7E96]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={contactImg}
                  alt="Contact Us"
                  className="w-full h-full object-top"
                />
              </div>
            </div>
          </div>

          {/* Right - Form / Success state (ONLY ONE FORM, no nesting) */}
          <div className="bg-white p-8 md:p-10 border border-[#e8e8e8]">
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#4A7E96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail
                    size={28}
                    strokeWidth={1.2}
                    className="text-[#4A7E96]"
                  />
                </div>
                <h3
                  className="text-2xl font-light text-[#1a1a1a] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Message Sent!
                </h3>
                <p className="text-[#666] text-sm font-light">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={handleSendAnother}
                  className="mt-6 text-[#4A7E96] text-xs tracking-[0.15em] uppercase underline hover:text-[#B5685A] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@email.com"
                      className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200 bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option>Book Appointment</option>
                      <option>Eye Examination</option>
                      <option>Eyewear Enquiry</option>
                      <option>Insurance Query</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200 resize-none"
                  />
                </div>

                {submitError && (
                  <p className="text-xs text-[#B5685A] bg-[#B5685A]/5 border border-[#B5685A]/20 px-4 py-3">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#4A7E96] text-white py-4 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#B5685A] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── GOOGLE MAP ── */}
      <section className="bg-white py-0">
        <div className="w-full h-[450px] bg-[#f8f8f6] relative">
          <iframe
            title="Hopeville Eye Clinic Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.537!2d7.0134!3d4.8242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDknMjcuMSJOIDfCsDAwJzQ4LjIiRQ!5e0!3m2!1sen!2sng!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(20%) contrast(1.05)" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute top-8 left-8 bg-white shadow-xl p-6 max-w-xs hidden md:block">
            <p
              className="text-[#B5685A] text-xs tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Find Us
            </p>
            <h3
              className="text-lg font-medium text-[#1a1a1a] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Hopeville Eye Clinic
            </h3>
            <p className="text-[#666] text-sm font-light leading-relaxed">
              #64 Alcon Road, Woji
              <br />
              Port-Harcourt, Rivers State
            </p>
            <a
              href="https://maps.google.com/?q=64+Alcon+Road+Woji+Port+Harcourt"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-xs tracking-[0.15em] uppercase text-[#4A7E96] hover:text-[#B5685A] transition-colors duration-200 font-medium"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQS ── */}
      <section className="bg-[#f8f8f6] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p
              className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Got Questions?
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[#e8e8e8] bg-white overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 md:px-8 py-5 text-left group"
                >
                  <span
                    className="text-base font-medium text-[#1a1a1a] group-hover:text-[#4A7E96] transition-colors duration-200 pr-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    className={`text-[#4A7E96] shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 md:px-8 pb-6 border-t border-[#e8e8e8]">
                    <p className="text-[#666] text-xs md:text-sm leading-relaxed font-light pt-5">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
