"use client";
import Link from "next/link";
import { useState } from "react";

export default function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Here you would eventually send the email to your backend to add to a waitlist table
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="flex justify-between items-center py-6 px-8 md:px-16 border-b border-gray-100">
        <div className="text-xl font-light tracking-wide text-gray-900">
          Huff-a-Puff
        </div>

        <nav className="hidden md:flex gap-8 text-[14px] font-medium text-gray-400">
          <Link href="#" className="hover:text-gray-600 transition-colors pb-1">Features</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors pb-1">About</Link>
          <Link href="#" className="text-[#2196F3] border-b-2 border-[#2196F3] pb-1 transition-colors">Early Access</Link>
        </nav>

        <button className="px-6 py-2.5 text-[13px] font-medium text-white bg-[#2196F3] rounded hover:bg-[#1E88E5] transition-colors tracking-wide">
          Join Waitlist
        </button>
      </header>

      {/* MAIN CONTENT */}
      <section className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
        
        {/* Minimalist Graphic (SVG) */}
        <div className="mb-10">
          <svg width="120" height="140" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            {/* Subtle Smoke Wisps */}
            <path d="M50 40 C 30 20, 70 10, 50 -10" stroke="#E5E7EB" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M55 30 C 75 15, 35 5, 55 -15" stroke="#F3F4F6" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <path d="M45 50 C 25 35, 65 20, 45 0" stroke="#F3F4F6" strokeWidth="0.5" fill="none" strokeLinecap="round" />

            {/* Main Device / Cylinder */}
            <rect x="42" y="55" width="16" height="40" rx="1" stroke="#D1D5DB" strokeWidth="1.5" fill="white" />
            
            {/* Base Line Detail */}
            <line x1="42" y1="85" x2="58" y2="85" stroke="#D1D5DB" strokeWidth="1.5" />

            {/* Bottom Tray / Plate */}
            <ellipse cx="50" cy="100" rx="28" ry="8" stroke="#D1D5DB" strokeWidth="1.5" fill="none" />
            <ellipse cx="50" cy="100" rx="16" ry="4" stroke="#E5E7EB" strokeWidth="1" fill="none" />
            
            {/* Tray Reflection/Shadow line */}
            <path d="M25 102 Q 50 115 75 102" stroke="#E5E7EB" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Typography */}
        <h1 className="text-4xl md:text-[42px] font-semibold text-gray-900 mb-6 tracking-tight">
          Oh! You&apos;re Early Here!
        </h1>
        
        <p className="text-[17px] text-gray-500 font-light leading-relaxed max-w-xl mx-auto mb-10">
          We are currently crafting a serene and sophisticated experience. Leave your details to be notified when the smoke clears and we open our doors.
        </p>

        {/* Input Form */}
        {submitted ? (
          <div className="bg-[#F0F9FF] border border-[#2196F3] text-[#0055A4] px-8 py-4 rounded-md inline-block font-light">
            Thank you! We&apos;ll notify you as soon as we open.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px] mx-auto">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              className="flex-grow px-5 py-3.5 bg-white border border-gray-200 rounded text-gray-800 placeholder-gray-400 font-light focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors shadow-sm"
            />
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-[#2196F3] text-white text-[15px] font-medium rounded hover:bg-[#1E88E5] transition-colors tracking-wide whitespace-nowrap shadow-sm"
            >
              Notify Me
            </button>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col md:flex-row justify-between items-center py-8 px-8 md:px-16 border-t border-gray-100 gap-4">
        <div className="text-[14px] text-gray-400 font-light">
          © 2024 Huff-a-Puff Collective. All rights reserved.
        </div>
        
        <div className="flex gap-8 text-[14px] font-medium text-gray-400">
          <Link href="#" className="hover:text-gray-600 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors">Terms</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors">Twitter</Link>
        </div>
      </footer>

    </main>
  );
}