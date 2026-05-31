'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../../components/Sidebar';
import { Bell, Mail, User, Check, Image as ImageIcon, PenLine, FileText } from 'lucide-react';

const AVAILABLE_INTERESTS = [
  "Tech Treasures", "Retro Fashion", "Coffee Pairings", "Startups", "Rare Finds", 
  "Food Connoisseurs", "History", "Events", "Community", "Art"
];

export default function ProfilePage() {
  const router = useRouter();
  
  // Form States
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // File Upload States & Refs
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const bannerInputRef = useRef(null);

  // Fetch username & existing profile data on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('huff_username');
    if (storedUsername) {
      setUsername(storedUsername);
      
      const fetchExistingProfile = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/profile/${storedUsername}`);
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) setDisplayName(data.display_name);
            if (data.bio) setBio(data.bio);
            if (data.interests && data.interests.length > 0) setSelectedInterests(data.interests);
            if (data.avatar_url) setAvatarPreview(data.avatar_url);
            if (data.banner_pic_url) setBannerPreview(data.banner_pic_url);
          }
        } catch (error) {
          console.error("Failed to load existing profile", error);
        }
      };
      fetchExistingProfile();
    }
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    router.push(`/profile/${username}`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('huff_token');
      const formData = new FormData();
      
      if (displayName) formData.append('display_name', displayName);
      if (bio) formData.append('bio', bio);
      if (selectedInterests.length > 0) formData.append('interests', selectedInterests.join(','));
      
      if (avatarFile) formData.append('avatar', avatarFile);
      if (bannerFile) formData.append('banner_pic', bannerFile);

      const response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        // Stop the "Complete your profile" prompt from showing up again!
        localStorage.setItem('huff_profile_completed', 'true');
        router.push(`/profile/${username}`);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <div className="flex bg-neutral-100 min-h-screen relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <header className="h-[80px] w-full flex items-center justify-end px-10 relative z-20 shrink-0">
          <div className="flex items-center gap-6">
            <button className="text-neutral-500 hover:text-[#2196F3] transition"><Bell size={24} className="stroke-[1.5]" /></button>
            <button className="text-neutral-500 hover:text-[#2196F3] transition"><Mail size={24} className="stroke-[1.5]" /></button>
            <div className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-neutral-200 text-neutral-500 bg-white shadow-sm overflow-hidden">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Nav Avatar" width={42} height={42} className="object-cover w-full h-full" />
              ) : (
                <User size={22} className="stroke-[1.5]" />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-10 pt-2 w-full max-w-4xl mx-auto relative pb-20">
          <div className="absolute top-[18%] -left-20 text-[#2196F3]/10 -z-10 -rotate-12 pointer-events-none select-none">
            <FileText size={180} strokeWidth={1} />
          </div>
          <div className="absolute top-[55%] -right-24 text-[#2196F3]/10 -z-10 -rotate-[165deg] pointer-events-none select-none">
            <PenLine size={220} strokeWidth={1} />
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-white p-12 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
            <div className="mb-10">
              <h1 className="text-3xl font-semibold text-[#2196F3] font-satoshi mb-2">Edit Profile</h1>
              <p className="text-neutral-500 font-general-sans text-[15.5px]">Refine your identity within the lounge. Keep it simple, clear, and true to your ritual.</p>
            </div>

            <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerChange} className="hidden" />
            <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />

            <div className="mb-12">
              <div onClick={() => bannerInputRef.current?.click()} className="w-full h-[220px] bg-gradient-to-r from-[#F0F7FF] to-[#E3F2FD] rounded-[24px] border border-[#E3F2FD] flex items-center justify-center overflow-hidden relative group cursor-pointer">
                {bannerPreview ? (
                  <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-[#2196F3]/40 group-hover:scale-110 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  {bannerPreview && <ImageIcon size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />}
                </div>
              </div>
              
              <div onClick={() => avatarInputRef.current?.click()} className="w-[120px] h-[120px] bg-[#E0F2F1] rounded-[28px] border-4 border-white shadow-sm -mt-16 ml-8 flex items-center justify-center relative z-10 group cursor-pointer hover:bg-neutral-100 transition-colors overflow-hidden">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar Preview" fill className="object-cover" />
                ) : (
                  <User size={40} className="text-neutral-400 stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center z-20">
                  {avatarPreview && <User size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />}
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700 font-satoshi">Username</label>
                  <input type="text" disabled value={username ? `@${username}` : ''} placeholder="@username" className="w-full bg-neutral-50 border border-neutral-200 text-neutral-400 px-4 py-3.5 rounded-2xl font-general-sans text-[15px] cursor-not-allowed outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-700 font-satoshi">Display Name</label>
                  <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jonathan Ashwood" className="w-full bg-white border border-neutral-200 text-neutral-900 px-4 py-3.5 rounded-2xl font-general-sans text-[15px] focus:border-[#2196F3] focus:ring-2 focus:ring-[#E3F2FD] outline-none transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-neutral-700 font-satoshi">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Collector of rare robustos. Weekend coffee enthusiast. Seeking the perfect pairing in quiet corners." className="w-full bg-white border border-neutral-200 text-neutral-900 px-4 py-3.5 rounded-2xl font-general-sans text-[15px] focus:border-[#2196F3] focus:ring-2 focus:ring-[#E3F2FD] outline-none transition-all min-h-[120px] resize-none" />
              </div>

              <div className="mt-2">
                <h3 className="text-xl font-semibold text-neutral-900 font-satoshi mb-1">Interests</h3>
                <p className="text-sm text-neutral-500 font-general-sans mb-5">Select the topics that resonate with your lifestyle.</p>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-[20px] font-medium font-satoshi text-[14.5px] transition-all duration-200 ${isSelected ? 'bg-[#E3F2FD] text-[#2196F3] border border-[#E3F2FD]' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'}`}>
                        {isSelected && <Check size={16} strokeWidth={2.5} />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-100 my-2" />

              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCancel} className="px-8 py-3.5 rounded-[18px] bg-white border border-[#2196F3] text-[#2196F3] font-semibold font-satoshi text-[15px] hover:bg-[#F0F7FF] transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-8 py-3.5 rounded-[18px] bg-[#2196F3] text-white font-semibold font-satoshi text-[15px] hover:bg-[#1E88E5] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}