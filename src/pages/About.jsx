import { Link } from "react-router-dom";
import {
  Eye,
  Award,
  Users,
  Heart,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import {team, values, milestones, stats}from "../data/about";

import pageBg from "../assets/page-bg.png";
import abtImg from "../assets/abt.png";

function About() {
  
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
          
          <h1
            className="text-4xl md:text-6xl font-light text-white leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
           Our Story
          </h1>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Right - image placeholder */}
          <div className="relative hidden md:block">
            <div className="w-full h-[500px] overflow-hidden">
              <img
                src={abtImg}
                alt="Visit Us"
                className="w-full h-full object-cover object-top"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/15"></div>
            </div>

            {/* Stats overlay
            <div className="absolute bottom-8 right-8 bg-white shadow-xl p-6 w-48">
              <p
                className="text-4xl font-light text-[#4A7E96] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                15+
              </p>
              <p className="text-xs text-[#888] tracking-[0.15em] uppercase">
                Years of Excellence
              </p>
            </div> */}
          </div>
          {/* Left */}
          <div>
            <p
              className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              About Hopeville
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1a1a1a] leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Where Precision Meets Luxury Vision Care
            </h2>
            <p className="text-[#555] text-base  leading-relaxed mb-5 font-light">
              At Hopeville Eye Clinic, we believe exceptional eye care should be
              both medically rigorous and elegantly delivered. For over 15
              years, we have served the Port Harcourt community with clinical
              excellence and a warm, patient-first approach.
            </p>
            <p className="text-[#555] text-base  leading-relaxed mb-8 font-light">
              Our team of dedicated vision specialists combines cutting-edge
              diagnostics with a genuine passion for preserving and enhancing
              your sight — because we understand that your eyes are your window
              to the world.
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {[
                "Certified & experienced vision specialists",
                "State-of-the-art diagnostic equipment",
                "Luxury eyewear boutique on-site",
                "Personalized treatment plans for every patient",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle
                    size={16}
                    className="text-[#4A7E96] shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-[#444] text-sm md:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/book"
              className="border border-[#4A7E96] text-[#4A7E96] px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#4A7E96] hover:text-white transition-all duration-300 inline-block font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Book An Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-[#f8f8f6] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p
              className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              What Drives Us
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => { 
              const Icon = value.icon; 
              return (
                <div
                  key={value.title}
                  className="bg-white p-8 md:p-10 border border-[#e8e8e8] hover:border-[#4A7E96] hover:shadow-lg transition-all duration-300 group"
                >
                <div className="text-[#4A7E96] mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={28} strokeWidth={1.2} />
                </div>
                <h3
                  className="text-lg md:text-xl font-medium text-[#1a1a1a] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {value.title}
                </h3>
                <p className="text-[#666] text-sm leading-relaxed font-light">
                  {value.desc}
                </p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p
              className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Our Journey
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-[#e8e8e8] md:-translate-x-1/2" />

            <div className="flex flex-col gap-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-[#4A7E96] border-2 border-white shadow md:-translate-x-1/2 mt-1 md:mt-0" />

                  {/* Content */}
                  <div
                    className={`ml-10 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}
                  >
                    <span
                      className="text-[#B5685A] text-sm tracking-[0.2em] font-medium"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {milestone.year}
                    </span>
                    <h3
                      className="text-xl md:text-2xl font-medium text-[#1a1a1a] mt-1 mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {milestone.title}
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed font-light">
                      {milestone.desc}
                    </p>
                  </div>

                  {/* Empty side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATISTICS ── */}
      <section className="bg-[#0d1f2d] py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-5xl font-light text-white mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stat.number}
              </p>
              <p className="text-[#F5F0E8]/90 text-sm tracking-[0.2em] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-[#f8f8f6] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p
              className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The People Behind Your Care
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Meet Our Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="group">
                {/* Photo */}
                <div className="relative bg-[#e8e8e8] aspect-[3/4] overflow-hidden mb-5 flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Users
                        size={48}
                        strokeWidth={0.8}
                        className="text-[#aaa]"
                      />
                      <p className="text-xs text-[#bbb] tracking-widest uppercase">
                        Photo
                      </p>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#0d1f2d]/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <p className="text-white/80 text-xs tracking-[0.2em] uppercase text-center px-4 font-light">
                      {member.specialty}
                    </p>
                  </div>
                </div>
                <h3
                  className="text-lg font-medium text-[#1a1a1a]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {member.name}
                </h3>
                <p className="text-[#B5685A] text-xs tracking-[0.15em] uppercase mt-1">
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
