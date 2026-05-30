import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-800 flex flex-col relative overflow-hidden">
      
      {/* GLOBAL BACKGROUND WAVES (Ethereal Lines) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40">
        <svg className="w-[120vw] h-[120vh] min-w-[1200px]" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 600 C 300 600, 400 200, 800 250 C 1100 280, 1200 400, 1400 400" stroke="#E0F2FE" strokeWidth="1.5" />
          <path d="M100 800 C 400 750, 500 350, 900 400 C 1200 430, 1250 150, 1400 100" stroke="#F0F9FF" strokeWidth="2" />
          <path d="M400 900 C 600 600, 700 150, 1000 200 C 1200 230, 1300 500, 1400 600" stroke="#E0F2FE" strokeWidth="1" />
        </svg>
      </div>

      {/* TOP NAVIGATION */}
      <header className="relative z-20 flex justify-between items-center py-6 px-8 lg:px-16 bg-white/60 backdrop-blur-sm border-b border-gray-50">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#2196F3]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12C4 12 5.5 8 10 8C14.5 8 16 12 16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3"/>
            <path d="M8 16C8 16 9.5 13 13 13C16.5 13 18 16 18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 4"/>
            <path d="M2 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 16H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-light tracking-wide text-[#0055A4]">Huff-a-Puff</span>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex gap-10 text-[14px] font-light text-gray-400">
          <Link href="#" className="text-[#2196F3] border-b border-[#2196F3] pb-1 transition-colors">Discover</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors pb-1">Lounges</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors pb-1">Traditions</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-6 py-2 text-[14px] font-medium text-[#2196F3] border border-[#2196F3] rounded hover:bg-[#F0F9FF] transition-colors tracking-wide"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2 text-[14px] font-medium text-white bg-[#2196F3] rounded hover:bg-[#1E88E5] transition-colors tracking-wide"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 mt-20 mb-16">
        
        {/* Ethereal Icon */}
        <div className="mb-8 text-[#90CAF9] opacity-80">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
            <line x1="12" y1="7" x2="12" y2="13" />
            <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight text-center">
          Enthusiasts&apos; Den
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl text-center mb-10">
          Join a serene community of enthusiasts. Share rituals, discover lounges, and 
          connect in a space designed for quiet reflection and appreciation.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/register" 
            className="px-8 py-3 bg-[#2196F3] text-white text-[15px] font-medium rounded hover:bg-[#1E88E5] transition-colors tracking-wide shadow-sm"
          >
            Sign Up
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-3 bg-white text-[#2196F3] text-[15px] font-medium border border-[#2196F3] rounded hover:bg-[#F0F9FF] transition-colors tracking-wide"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 mb-24 flex flex-col md:flex-row gap-8">
        
        {/* Discover Card */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg p-10 relative overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-shadow group cursor-default">
          {/* Card Internal SVG Graphic */}
          <div className="absolute right-8 top-12 opacity-30 text-[#90CAF9] pointer-events-none transition-transform duration-700 group-hover:-translate-y-2">
             <svg width="80" height="40" viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="1">
               <path d="M0 20 Q 20 0, 40 20 T 80 20" fill="none"/>
               <path d="M0 25 Q 20 5, 40 25 T 80 25" fill="none" opacity="0.5"/>
             </svg>
          </div>

          <div className="w-10 h-10 bg-[#2196F3] rounded-full flex items-center justify-center text-white mb-6 shadow-md shadow-blue-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>
          
          <h3 className="text-[26px] font-normal text-gray-900 mb-3 tracking-tight">Discover Lounges</h3>
          <p className="text-[15px] text-gray-500 font-light leading-relaxed max-w-[280px]">
            Find the perfect atmosphere for your next session. Curated spots globally.
          </p>
        </div>

        {/* Share Traditions Card */}
        <div className="flex-1 bg-white border border-gray-100 rounded-lg p-10 relative overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-shadow group cursor-default">
          {/* Card Internal SVG Graphic */}
          <div className="absolute right-0 bottom-0 opacity-20 text-[#90CAF9] pointer-events-none transition-transform duration-1000 group-hover:scale-105 group-hover:-translate-x-2">
             <svg width="200" height="150" viewBox="0 0 200 150" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M50 150 C 80 80, 150 100, 200 50" fill="none"/>
               <path d="M0 150 C 50 100, 120 120, 200 20" fill="none" opacity="0.4"/>
             </svg>
          </div>

          <div className="w-10 h-10 bg-transparent flex items-center justify-center text-[#2196F3] mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
              <path d="M7 9H17V11H7V9Z"/>
            </svg>
          </div>
          
          <h3 className="text-[26px] font-normal text-gray-900 mb-3 tracking-tight">Share Traditions</h3>
          <p className="text-[15px] text-gray-500 font-light leading-relaxed max-w-[360px]">
            Connect with connoisseurs. Exchange reviews, pairings, and quiet moments in a minimalist digital space.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-gray-100 py-8 px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
        <span className="text-gray-300 text-lg font-light tracking-wide">Huff-a-Puff</span>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[11px] tracking-[0.15em] text-gray-400 font-medium uppercase">
          <Link href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors">Community Guidelines</Link>
          <Link href="#" className="hover:text-gray-600 transition-colors">Contact</Link>
        </div>
        
        <span className="text-[11px] tracking-[0.1em] text-gray-400 font-light uppercase">
          © 2026 Huff-a-Puff.
        </span>
      </footer>

    </main>
  );
}