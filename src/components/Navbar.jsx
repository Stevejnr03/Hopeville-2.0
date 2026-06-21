import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/hope-logo.png";
import { Menu, X, Heart, ShoppingBag, User } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-[#e8e0d5]">
      {/* Top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#4A7E96] via-[#B5685A] to-[#4A7E96]" />

      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Hopeville Eye Clinic" className="h-14 w-auto" />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-[#1a1a1a] font-semibold hover:text-[#B5685A] transition-colors duration-300 text-sm tracking-[0.12em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Icons + CTA */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-4 border-r border-[#d0c8be] pr-5">
            <Link
              to="/wishlist"
              className="text-[#1a1a1a] hover:text-[#B5685A] transition-colors duration-200"
            >
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link
              to="/cart"
              className="text-[#1a1a1a] hover:text-[#B5685A] transition-colors duration-200"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </Link>
            <Link
              to="/login"
              className="text-[#1a1a1a] hover:text-[#B5685A] transition-colors duration-200"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
          </div>

          <Link
            to="/book"
            className="border border-[#4A7E96] text-[#4A7E96] px-6 py-2 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#4A7E96] hover:text-white transition-all duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/wishlist" className="text-[#1a1a1a] hover:text-[#B5685A]">
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/cart" className="text-[#1a1a1a] hover:text-[#B5685A]">
            <ShoppingBag size={20} strokeWidth={1.5} />
          </Link>
          <Link to="/account" className="text-[#1a1a1a] hover:text-[#B5685A]">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button className="text-[#1a1a1a]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-8 pb-8 flex flex-col gap-5 border-t border-[#e8e0d5]">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-[#1a1a1a] font-semibold hover:text-[#B5685A] transition-colors duration-200 text-sm tracking-[0.12em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/book"
            onClick={() => setIsOpen(false)}
            className="border border-[#4A7E96] text-[#4A7E96] px-6 py-2 text-xs tracking-[0.15em] uppercase font-semibold text-center hover:bg-[#4A7E96] hover:text-white transition-all duration-300"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
