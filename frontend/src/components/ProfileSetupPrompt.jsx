'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

export default function ProfileSetupPrompt() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  useEffect(() => {
    const checkProfileStatus = async () => {
      const username = localStorage.getItem('huff_username');
      const token = localStorage.getItem('huff_token');
      
      if (!username || !token) return;

      // 1. Did the user explicitly ask us to stop showing this?
      const hidePrompt = localStorage.getItem(`hide_profile_prompt_${username}`);
      if (hidePrompt === 'true') return;

      // 2. Is their profile already complete? 
      // (Right now this relies on a local storage flag. Once we build the /api/profile 
      // backend route, you will replace these two lines with an API fetch to check bio/pfp).
      const isProfileComplete = localStorage.getItem(`profile_complete_${username}`);
      if (isProfileComplete === 'true') return;

      // If we pass both checks, show the beautiful modal
      setIsVisible(true);
    };

    // Small delay so it feels like a smooth pop-in after the feed loads
    const timer = setTimeout(() => {
      checkProfileStatus();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    router.push('/profile');
  };

  const handleSkip = () => {
    if (dontAskAgain) {
      // Save their preference tied strictly to their username
      const username = localStorage.getItem('huff_username');
      localStorage.setItem(`hide_profile_prompt_${username}`, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-white border border-[#E3F2FD] shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[32px] p-10 w-[400px] max-w-[90vw] flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Background decorative circles matching your screenshot */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 border border-neutral-50 rounded-full pointer-events-none" />
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 border border-neutral-50 rounded-full pointer-events-none" />

        {/* Icon Area */}
        <div className="w-16 h-16 bg-[#F0F7FF] border border-[#E3F2FD] rounded-2xl flex items-center justify-center text-[#2196F3] mb-6">
          <UserPlus size={28} className="stroke-[1.5]" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-semibold text-neutral-900 font-satoshi mb-3">
          Complete your profile?
        </h2>
        <p className="text-[15px] text-neutral-500 font-general-sans leading-relaxed mb-8 px-2">
          Adding a few details helps us personalize your ethereal experience.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mb-6">
          <button
            onClick={handleContinue}
            className="w-full bg-[#2196F3] hover:bg-[#1E88E5] text-white font-medium py-3.5 rounded-xl transition-colors font-satoshi text-[15.5px] shadow-sm hover:shadow-md"
          >
            Continue
          </button>
          <button
            onClick={handleSkip}
            className="w-full bg-white border border-[#2196F3] text-[#2196F3] hover:bg-[#F0F7FF] font-medium py-3.5 rounded-xl transition-colors font-satoshi text-[15.5px]"
          >
            Skip for now
          </button>
        </div>

        {/* Checkbox Area */}
        <label className="flex items-center justify-center gap-3 cursor-pointer group mt-1">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              className="peer appearance-none w-[18px] h-[18px] border-[1.5px] border-neutral-300 rounded-[4px] checked:bg-[#2196F3] checked:border-[#2196F3] hover:border-[#2196F3] transition-all cursor-pointer"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
            />
            {/* Custom Checkmark SVG */}
            <svg
              className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[13.5px] text-neutral-500 group-hover:text-neutral-800 transition-colors font-general-sans select-none">
            Don't Ask Me Again
          </span>
        </label>
        
      </div>
    </div>
  );
}