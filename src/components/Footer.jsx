import { Link } from "react-router-dom";
import logo from "../assets/hope-logo.png";
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { MapPin, Phone, Mail, Clock } from "lucide-react";

function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "Book Appointment", path: "/book" },
  ];

  const services = [
    "Complete Eye Health Diagnostics",
    "Retinal Evaluation",
    "Diabetic & Hypertensive Vision Care",
    "Cataract & Glaucoma Co. Management",
    "Dry Eye Clinic",
    "Luxury Eyewear & Optical Services",
  ];

  return (
    <footer className="bg-[#0d1f2d] text-white">
      {/* Top accent */}
      <div className="h-[3px] bg-gradient-to-r from-[#4A7E96] via-[#B5685A] to-[#4A7E96]" />

      {/* Newsletter Bar */}
      <div className="border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p
              className="text-[#B5685A] text-xs tracking-[0.3em] uppercase mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Stay Updated
            </p>
            <h3
              className="text-xl md:text-2xl font-light text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Subscribe to Our Newsletter
            </h3>
          </div>
          <div className="flex w-full md:w-auto gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-5 py-3 text-sm focus:outline-none focus:border-[#4A7E96] w-full md:w-72 transition-colors duration-200"
            />
            <button
              className="bg-[#4A7E96] text-white px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#B5685A] transition-all duration-300 whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - Brand */}
          <div>
            <Link to="/">
              <img
                src={logo}
                alt="Hopeville Eye Clinic"
                className="h-16 w-auto mb-6 brightness-0 invert"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
              Port Harcourt's premier destination for comprehensive eye care and
              luxury eyewear. Where precision meets elegance.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: <FaInstagram size={16} />, href: "#" },
                { icon: <FaFacebook size={16} />, href: "#" },
                { icon: <FaXTwitter size={16} />, href: "#" },
                { icon: <FaYoutube size={16} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-[#4A7E96] hover:text-[#4A7E96] transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4
              className="text-white text-sm tracking-[0.2em] uppercase font-medium mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/60 text-sm hover:text-[#4A7E96] transition-colors duration-200 font-light flex items-center gap-2 group"
                  >
                    <span className="w-4 h-[1px] bg-white/20 group-hover:bg-[#4A7E96] group-hover:w-6 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div>
            <h4
              className="text-white text-sm tracking-[0.2em] uppercase font-medium mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-white/60 text-sm hover:text-[#4A7E96] transition-colors duration-200 font-light flex items-center gap-2 group"
                  >
                    <span className="w-4 h-[1px] bg-white/20 group-hover:bg-[#4A7E96] group-hover:w-6 transition-all duration-300 shrink-0" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4
              className="text-white text-sm tracking-[0.2em] uppercase font-medium mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Contact Us
            </h4>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#4A7E96] shrink-0 mt-1"
                />
                <p className="text-white/60 text-sm font-light leading-relaxed">
                  #64 Alcon Road, Woji
                  <br />
                  Port-Harcourt, Rivers State
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#4A7E96] shrink-0"
                />
                <a
                  href="tel:+2348133300378"
                  className="text-white/60 text-sm font-light hover:text-[#4A7E96] transition-colors duration-200"
                >
                  +234 813 330 0378
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#4A7E96] shrink-0"
                />
                <a
                  href="mailto:Hopevilleeyeclinicltd@gmail.com"
                  className="text-white/60 text-sm font-light hover:text-[#4A7E96] transition-colors duration-200 break-all"
                >
                  Hopevilleeyeclinicltd@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  size={16}
                  strokeWidth={1.5}
                  className="text-[#4A7E96] shrink-0 mt-1"
                />
                <div className="text-white/60 text-sm font-light leading-relaxed">
                  <p>Mon – Fri: 8:00 AM – 5:30 PM</p>
                  <p>Saturday: 10:00 AM – 3:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Book CTA */}
              <Link
                to="/book"
                className="mt-2 bg-[#4A7E96] text-white px-6 py-3 text-xs tracking-[0.15em] uppercase text-center hover:bg-[#B5685A] transition-all duration-300 font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs tracking-wide text-center md:text-left">
            © {new Date().getFullYear()} Hopeville Eye Clinic Ltd. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-white/40 text-xs hover:text-white/70 transition-colors duration-200 tracking-wide"
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
