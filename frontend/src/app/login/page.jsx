"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "" });

    const submitData = new FormData();
    submitData.append("username", formData.username);
    submitData.append("password", formData.password);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        body: submitData,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Login failed");

      // Save the VIP Token to the browser
      localStorage.setItem("huff_token", data.access_token);
      localStorage.setItem("huff_username", data.username);
      
      router.push("/early-access"); 
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white font-sans text-gray-800">
      
      {/* LEFT SIDE: Visual Canvas */}
      <section className="hidden md:flex flex-col w-1/2 relative justify-center items-center p-12 overflow-hidden bg-[#FAFAFA] border-r border-gray-100">
        
        {/* Abstract Background Waves SVG */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 flex items-center justify-center">
          <svg className="w-full h-full max-w-[800px]" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 200 C 100 150, 300 250, 500 200 C 700 150, 850 250, 900 200" fill="none" stroke="#E0F2FE" strokeWidth="1" />
            <path d="M-100 250 C 150 200, 250 300, 450 250 C 650 200, 800 280, 900 250" fill="none" stroke="#F0F9FF" strokeWidth="1" />
          </svg>
        </div>

        {/* Central Matchstick/Smoke Graphic */}
        <div className="relative z-10 flex flex-col items-center mb-12">
          <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Elegant Smoke Paths */}
            <path d="M60 140 C 40 80, 20 40, 60 10" stroke="#2196F3" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6"/>
            <path d="M60 140 C 80 90, 100 50, 50 20" stroke="#2196F3" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.4"/>
            {/* Minimalist Matchstick */}
            <rect x="59" y="145" width="2" height="30" fill="#D1D5DB" />
            <circle cx="60" cy="143" r="3.5" fill="#2196F3" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="relative z-10 text-center max-w-[320px]">
          <h2 className="text-4xl lg:text-5xl font-light text-[#0055A4] mb-6 tracking-tight leading-tight">
            Experience the<br/>Ritual.
          </h2>
          <p className="text-[15px] text-gray-500 font-light leading-relaxed">
            A minimalist sanctuary for the discerning smoking culture.
          </p>
        </div>

        {/* Corner Geometric Accent */}
        <div className="absolute bottom-12 left-12 opacity-30">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1 V 59 H 59" stroke="#2196F3" strokeWidth="0.5" />
          </svg>
        </div>
      </section>

      {/* RIGHT SIDE: Login Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative z-10">
        <div className="w-full max-w-[400px]">
          
          {/* Logo / Brand Header */}
          <div className="mb-14">
            <h1 className="text-[28px] font-light tracking-wide text-[#0055A4]">Huff-a-Puff</h1>
            <div className="w-8 h-[1.5px] bg-[#2196F3] mt-2"></div>
          </div>

          <header className="mb-10">
            <h2 className="text-2xl font-normal text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-[15px] text-gray-500 font-light">Please enter your details to access the lounge.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[11px] font-medium text-gray-500 tracking-[0.1em] uppercase" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input 
                  type="text" id="username" name="username" required onChange={handleInputChange} 
                  placeholder="alex.smoke" 
                  className="w-full px-4 py-3.5 bg-transparent border border-gray-200 rounded text-gray-800 placeholder-gray-300 font-light focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[11px] font-medium text-gray-500 tracking-[0.1em] uppercase" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input 
                  type="password" id="password" name="password" required onChange={handleInputChange} 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3.5 bg-transparent border border-gray-200 rounded text-gray-800 placeholder-gray-300 font-light focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between pt-1 pb-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 text-[#2196F3] border-gray-300 rounded focus:ring-[#2196F3] cursor-pointer" />
                <label htmlFor="remember" className="text-[13px] text-gray-500 font-light cursor-pointer">Remember me</label>
              </div>
              <a href="#" className="text-[13px] text-[#0055A4] hover:underline font-light">Forgot credentials?</a>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button 
                type="submit" disabled={status.loading} 
                className="w-full bg-[#2196F3] text-white text-[13px] font-medium py-3.5 rounded tracking-widest uppercase hover:bg-[#1E88E5] transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {status.loading ? "Authenticating..." : "Sign In"}
              </button>
              
              <Link 
                href="/register" 
                className="w-full bg-transparent border border-[#2196F3] text-[#2196F3] text-[13px] font-medium py-3.5 rounded tracking-widest uppercase hover:bg-[#F0F9FF] transition-colors text-center block"
              >
                Join Club
              </Link>
            </div>
            
            {status.error && <p className="text-red-500 text-center text-sm mt-2">{status.error}</p>}
          </form>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-xs text-gray-400 font-light">
              By entering, you agree to our <a href="#" className="underline hover:text-gray-600 transition-colors">Ethereal Terms</a>
            </p>
          </footer>

        </div>
      </section>
    </main>
  );
}