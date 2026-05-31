'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import { Bell, Mail, User, Image as ImageIcon, Edit3, ChevronLeft, ChevronRight, Heart, LogOut, FileText } from 'lucide-react';

export default function ProfileDisplayPage() {
  const params = useParams();
  const router = useRouter();
  const profileUsername = params.username;
  
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUname = localStorage.getItem('huff_username') || '';
      setCurrentUsername(currentUname);

      if (currentUname) {
        fetch(`http://127.0.0.1:8000/api/profile/${currentUname}`)
          .then(res => res.json())
          .then(data => {
            if (data.avatar_url) setCurrentUserAvatar(data.avatar_url);
          })
          .catch(err => console.error("Error fetching current user avatar", err));
      }
    }

    const fetchProfileData = async () => {
      try {
        const currentUser = localStorage.getItem('huff_username');
        setIsOwnProfile(currentUser === profileUsername);

        const profileRes = await fetch(`http://127.0.0.1:8000/api/profile/${profileUsername}`);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
        }

        const postsRes = await fetch(`http://127.0.0.1:8000/api/posts/user/${profileUsername}`);
        if (postsRes.ok) {
          const pData = await postsRes.json();
          setUserPosts(pData.feed);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileUsername]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('huff_token');
      if (token) {
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } finally {
      localStorage.removeItem('huff_token');
      localStorage.removeItem('huff_username');
      // THE FIX: Reset the profile completion flag on logout!
      localStorage.removeItem('huff_profile_completed'); 
      router.push('/login');
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-100" />;

  return (
    <div className="flex bg-neutral-100 min-h-screen relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <header className="h-[80px] w-full flex items-center justify-end px-10 relative z-50 shrink-0">
          <div className="flex items-center gap-6">
            <button className="text-neutral-500 hover:text-[#2196F3] transition"><Bell size={24} className="stroke-[1.5]" /></button>
            <button className="text-neutral-500 hover:text-[#2196F3] transition"><Mail size={24} className="stroke-[1.5]" /></button>
            
            <div className="relative group">
              <Link href={`/profile/${currentUsername}`}>
                <div className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-neutral-200 text-neutral-500 group-hover:border-[#2196F3] group-hover:text-[#2196F3] transition ml-2 bg-white shadow-sm overflow-hidden cursor-pointer relative">
                  {currentUserAvatar ? (
                    <Image src={currentUserAvatar} alt="Nav Avatar" width={42} height={42} className="object-cover w-full h-full" />
                  ) : (
                    <User size={22} className="stroke-[1.5]" />
                  )}
                </div>
              </Link>

              <div className="absolute right-0 top-[42px] pt-3 hidden group-hover:block z-50">
                <div className="bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[24px] p-2 w-44 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => router.push(`/profile/${currentUsername}`)}
                    className="flex items-center gap-3 px-4 py-3 text-[14.5px] font-semibold text-neutral-700 hover:text-[#2196F3] hover:bg-[#F0F7FF] rounded-[16px] transition-colors font-satoshi"
                  >
                    <User size={18} className="stroke-[2.25]" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-[14.5px] font-semibold text-neutral-600 hover:text-red-500 hover:bg-red-50 rounded-[16px] transition-colors font-satoshi"
                  >
                    <LogOut size={18} className="stroke-[2.25]" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

          </div>
        </header>

        <main className="flex-1 p-10 pt-2 w-full max-w-4xl mx-auto">
          <div className="bg-white border border-neutral-100 rounded-[40px] shadow-sm mb-12">
            
            <div className="w-full h-[220px] bg-gradient-to-r from-[#F0F7FF] to-[#E3F2FD] relative rounded-t-[40px] overflow-hidden flex items-center justify-center">
              {profileData?.banner_pic_url ? (
                <Image src={profileData.banner_pic_url} alt="Banner" fill className="object-cover" />
              ) : (
                <ImageIcon size={40} className="text-[#2196F3]/30 stroke-[1.5]" />
              )}
            </div>

            <div className="px-12 pb-12 relative">
              <div className="absolute -top-16 left-12 w-[120px] h-[120px] bg-[#E0F2F1] rounded-[28px] border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                {profileData?.avatar_url ? (
                  <Image src={profileData.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <User size={40} className="text-neutral-400 stroke-[1.5]" />
                )}
              </div>

              <div className="pt-20 flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-light text-neutral-900 tracking-tight font-satoshi mb-1">
                    @{profileData?.username}
                  </h1>
                  <h2 className="text-xl text-neutral-500 font-general-sans font-medium">
                    {profileData?.display_name || profileData?.username}
                  </h2>
                </div>

                {isOwnProfile && (
                  <button 
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 text-neutral-600 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors font-satoshi font-semibold text-[14.5px]"
                  >
                    <Edit3 size={16} className="stroke-[2.5]" />
                    Edit
                  </button>
                )}
              </div>

              {profileData?.bio && (
                <p className="mt-8 text-[16px] text-neutral-600 font-general-sans leading-relaxed max-w-2xl">
                  {profileData.bio}
                </p>
              )}

              <div className="w-16 h-[1px] bg-neutral-200 my-10" />

              {profileData?.interests?.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-semibold text-neutral-900 font-satoshi mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {profileData.interests.map(interest => (
                      <span key={interest} className="px-5 py-2 rounded-full bg-[#F0F7FF] text-[#2196F3] font-medium font-satoshi text-[14px]">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {userPosts.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-semibold text-neutral-900 font-satoshi mb-6">Posts</h3>
                  
                  <div className="relative group/carousel">
                    <button onClick={() => scroll('left')} className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-neutral-200 shadow-md rounded-full flex items-center justify-center text-neutral-600 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:text-[#2196F3]">
                      <ChevronLeft size={20} />
                    </button>

                    <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {userPosts.map(post => (
                        <div key={post._id} className="w-[340px] shrink-0 snap-start bg-white border border-neutral-100 shadow-sm rounded-3xl overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
                          
                          <div className="h-[180px] relative bg-neutral-50 border-b border-neutral-100 flex items-center justify-center">
                            {post.image_url ? (
                              <>
                                <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                                <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md border border-white/40 text-white shadow-sm text-[11px] tracking-wide uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 font-general-sans">
                                  <ImageIcon size={14} className="stroke-[2.5]"/> 
                                  contains image
                                </div>
                              </>
                            ) : (
                              <FileText size={40} className="text-neutral-200 stroke-[1]" />
                            )}
                          </div>

                          <div className="p-6">
                            <h4 className="font-satoshi text-lg font-bold text-neutral-900 truncate mb-1 group-hover:text-[#2196F3] transition-colors">
                              {post.title}
                            </h4>
                            <p className="font-general-sans text-[14.5px] text-neutral-500 line-clamp-2 leading-relaxed mb-4 min-h-[44px]">
                              {post.text_content}
                            </p>
                            
                            <div className="flex items-center gap-1.5 text-neutral-400 font-semibold text-sm">
                              <Heart size={16} className="stroke-[2.5]" />
                              {post.likes_count || 0}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                    <button onClick={() => scroll('right')} className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-neutral-200 shadow-md rounded-full flex items-center justify-center text-neutral-600 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10 hover:text-[#2196F3]">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}