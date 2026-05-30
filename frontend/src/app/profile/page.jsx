'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Bell, Mail, User, Check, Image as ImageIcon, PenLine, FileText } from 'lucide-react';

const AVAILABLE_INTERESTS = [
  "Cigars", "Pipes", "Coffee Pairings", "Lounge Reviews", "Rare Finds", 
  "Technique", "History", "Events", "Community", "Art"
];

export default function ProfilePage() {
  const router = useRouter();
  
  // States
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState(['Cigars', 'Coffee Pairings', 'Rare Finds', 'Art']);

  // Fetch username on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('huff_username');
    if (storedUsername) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername(storedUsername);
    }
  }, []);

  // Handlers
  const handleCancel = () => {
    router.push('/feed');
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Placeholder for future API call
    console.log("Saving profile...");
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="flex bg-neutral-100 min-h-screen relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        
        {/* Top Bar (Matching Feed Page) */}
        <header className="h-[80px] w-full flex items-center justify-end px-10 relative z-20">
          <div className="flex items-center gap-6">
            <button className="text-neutral-500 hover:text-[#2196F3] transition">
              <Bell size={24} className="stroke-[1.5]" />
            </button>
            <button className="text-neutral-500 hover:text-[#2196F3] transition">
              <Mail size={24} className="stroke-[1.5]" />
            </button>
            <div className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-neutral-200 text-neutral-500 bg-white shadow-sm">
              <User size={22} className="stroke-[1.5]" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-10 pt-2 w-full max-w-4xl mx-auto relative">
          
          {/* --- ETHEREAL BACKGROUND GRAPHICS --- */}
          {/* Left Blob: Notepad peeking out */}
          <div className="absolute top-[18%] -left-20 text-[#2196F3]/10 -z-10 -rotate-12 pointer-events-none select-none">
            <FileText size={180} strokeWidth={1} />
          </div>
          
          {/* Right Blob: Pencil peeking out (Flipped to show the tip) */}
          <div className="absolute top-[55%] -right-24 text-[#2196F3]/10 -z-10 -rotate-[165deg] pointer-events-none select-none">
            <PenLine size={220} strokeWidth={1} />
          </div>
          {/* ------------------------------------ */}

          <div className="bg-white/80 backdrop-blur-md border border-white p-12 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
            
            {/* Header Text */}
            <div className="mb-10">
              <h1 className="text-3xl font-semibold text-[#2196F3] font-satoshi mb-2">
                Edit Profile
              </h1>
              <p className="text-neutral-500 font-general-sans text-[15.5px]">
                Refine your identity within the lounge. Keep it simple, clear, and true to your ritual.
              </p>
            </div>

            {/* Media Area (Banner & Avatar) */}
            <div className="mb-12">
              {/* Banner Placeholder */}
              <div className="w-full h-40 bg-gradient-to-r from-[#F0F7FF] to-[#E3F2FD] rounded-[24px] border border-[#E3F2FD] flex items-center justify-center overflow-hidden relative group cursor-pointer">
                <ImageIcon size={32} className="text-[#2196F3]/40 group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              {/* Avatar Placeholder (Fixed) */}
              <div className="w-24 h-24 bg-neutral-50 rounded-[24px] border-4 border-white shadow-sm -mt-10 ml-8 flex items-center justify-center relative z-10 group cursor-pointer hover:bg-neutral-100 transition-colors">
                <User size={36} className="text-neutral-400 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700 font-satoshi">Username</label>
                  <input 
                    type="text" 
                    disabled
                    value={username ? `@${username}` : ''}
                    placeholder="@username" 
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-400 px-4 py-3.5 rounded-2xl font-general-sans text-[15px] cursor-not-allowed outline-none"
                  />
                </div>

                {/* Display Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700 font-satoshi">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jonathan Ashwood" 
                    className="w-full bg-white border border-neutral-200 text-neutral-900 px-4 py-3.5 rounded-2xl font-general-sans text-[15px] focus:border-[#2196F3] focus:ring-2 focus:ring-[#E3F2FD] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700 font-satoshi">Bio</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Collector of rare robustos. Weekend coffee enthusiast. Seeking the perfect pairing in quiet corners." 
                  className="w-full bg-white border border-neutral-200 text-neutral-900 px-4 py-3.5 rounded-2xl font-general-sans text-[15px] focus:border-[#2196F3] focus:ring-2 focus:ring-[#E3F2FD] outline-none transition-all min-h-[120px] resize-none"
                />
              </div>

              {/* Interests Section */}
              <div className="mt-2">
                <h3 className="text-xl font-semibold text-neutral-900 font-satoshi mb-1">Interests</h3>
                <p className="text-sm text-neutral-500 font-general-sans mb-5">Select the topics that resonate with your lifestyle.</p>
                
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`flex items-center gap-1.5 px-5 py-2.5 rounded-[20px] font-medium font-satoshi text-[14.5px] transition-all duration-200 ${
                          isSelected 
                            ? 'bg-[#E3F2FD] text-[#2196F3] border border-[#E3F2FD]' 
                            : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {isSelected && <Check size={16} strokeWidth={2.5} />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-100 my-2" />

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3.5 rounded-[18px] bg-white border border-[#2196F3] text-[#2196F3] font-semibold font-satoshi text-[15px] hover:bg-[#F0F7FF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-[18px] bg-[#2196F3] text-white font-semibold font-satoshi text-[15px] hover:bg-[#1E88E5] transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}