"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [idImage, setIdImage] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIdImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    if (!idImage) {
      setStatus({ loading: false, error: "Please upload an ID image.", success: "" });
      return;
    }

    const submitData = new FormData();
    submitData.append("username", formData.username);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("id_image", idImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        body: submitData,
      });
      const data = await response.json();

      if (!response.ok) {
        // If FastAPI sends an array of errors, stringify it so we can read it!
        const errorMessage = Array.isArray(data.detail) 
          ? JSON.stringify(data.detail) 
          : data.detail || "Registration failed";
        throw new Error(errorMessage);
      }

      setStatus({ loading: false, error: "", success: `Account created! Age verified: ${data.age_verified}` });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white font-sans text-gray-800">
      
      {/* LEFT SIDE: Branding Canvas */}
      <section className="hidden md:flex flex-col w-1/2 relative justify-center items-center p-12 overflow-hidden border-r border-gray-100">
        
        {/* Subtle SVG Background Swoosh */}
        <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-60">
          <svg viewBox="0 0 500 500" className="absolute -bottom-20 -left-20 w-[40rem] h-[40rem]" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400 C 150 350, 150 450, 300 300 C 400 200, 450 250, 500 100" fill="none" stroke="#E0F2FE" strokeWidth="1.5" />
            <path d="M-50 450 C 100 380, 200 480, 350 330" fill="none" stroke="#F0F9FF" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <h1 className="text-5xl font-light text-[#0055A4] mb-6 tracking-wide">
            Huff-a-Puff
          </h1>
          <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
            A refined experience for the modern enthusiast. Join our exclusive community of connoisseurs.
          </p>
          
          <div className="flex gap-8 justify-center">
            {/* Curated Quality Badge */}
            <div className="flex items-center gap-2 text-[#0055A4]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm font-medium">Curated Quality</span>
            </div>
            {/* Secure Portal Badge */}
            <div className="flex items-center gap-2 text-[#0055A4]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <span className="text-sm font-medium">Secure Portal</span>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE: Registration Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#FCFDFD]">
        <div className="w-full max-w-[440px]">
          
          <div className="mb-10">
            <h2 className="text-3xl font-normal text-gray-900 mb-3 tracking-tight">Begin your journey</h2>
            <p className="text-gray-500 font-light">Complete your profile to access our collections.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 tracking-wide block" htmlFor="username">Username</label>
              <input 
                type="text" id="username" name="username" required minLength={3} onChange={handleInputChange} 
                placeholder="e.g. cloud_seeker" 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors text-gray-800 placeholder-gray-400 font-light" 
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 tracking-wide block" htmlFor="email">Email Address</label>
              <input 
                type="email" id="email" name="email" required onChange={handleInputChange} 
                placeholder="name@example.com" 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors text-gray-800 placeholder-gray-400 font-light" 
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 tracking-wide block" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} id="password" name="password" required minLength={6} onChange={handleInputChange} 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors text-gray-800 placeholder-gray-400 font-light" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 tracking-wide block">Government ID Verification</label>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-6 bg-white hover:border-gray-300 transition-colors text-center cursor-pointer relative group">
                <input type="file" accept="image/*" id="id-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required onChange={handleFileChange} />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-gray-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z"/>
                  </svg>
                  <span className="text-[15px] font-normal text-gray-700">
                    {idImage ? idImage.name : "Click to upload or drag and drop"}
                  </span>
                  {!idImage && <span className="text-xs text-gray-400 font-light">PNG, JPG or PDF (max. 5MB)</span>}
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 text-[#1DA1F2] border-gray-300 rounded focus:ring-[#1DA1F2]" />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed font-light">
                I confirm that I am of legal age and agree to the <a href="#" className="text-[#0055A4] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0055A4] hover:underline">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" disabled={status.loading} 
              className="w-full py-3.5 mt-2 bg-[#2196F3] text-white text-sm font-medium rounded-md hover:bg-[#1E88E5] transition-colors disabled:opacity-70 flex justify-center items-center tracking-wide"
            >
              {status.loading ? "Verifying..." : "Create Account"}
            </button>
            
            {status.error && <p className="text-red-500 text-center text-sm mt-2">{status.error}</p>}
            {status.success && <p className="text-green-600 text-center text-sm mt-2">{status.success}</p>}
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center">
            <p className="text-sm text-gray-600 font-light">
              Already have an account? <Link href="/login" className="text-[#0055A4] font-medium hover:underline">Sign In</Link>
            </p>
            <div className="flex gap-6 mt-4">
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Help</a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}