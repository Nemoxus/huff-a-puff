'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Mail, User, Pen, LogOut } from 'lucide-react'; 
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import CreatePostModal from '../../components/CreatePostModal';
import ProfileSetupPrompt from '../../components/ProfileSetupPrompt';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uname = localStorage.getItem('huff_username') || '';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUsername(uname);
      
      if (uname) {
        fetch(`http://127.0.0.1:8000/api/profile/${uname}`)
          .then(res => res.json())
          .then(data => {
            if (data.avatar_url) setCurrentUserAvatar(data.avatar_url);
            
            // If they have any data at all, they completed it. If not, show prompt.
            if (data.display_name || data.avatar_url || data.bio) {
              localStorage.setItem('huff_profile_completed', 'true');
              setShowProfilePrompt(false);
            } else if (localStorage.getItem('huff_profile_completed') !== 'true') {
              setShowProfilePrompt(true);
            }
          })
          .catch(err => console.error("Error fetching user profile", err));
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('huff_token');
      if (token) {
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('huff_token');
      localStorage.removeItem('huff_username');
      // THE FIX: Reset the profile completion flag on logout!
      localStorage.removeItem('huff_profile_completed'); 
      router.push('/login');
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("huff_token"); 

      if (!token) {
        setError("Please log in to view the feed.");
        setLoading(false);
        router.push("/login");
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data.feed);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex bg-neutral-100 min-h-screen relative">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="h-[80px] w-full flex items-center justify-end px-10 z-50">
          <div className="flex items-center gap-6">
            <button className="text-neutral-500 hover:text-[#2196F3] transition"><Bell size={24} className="stroke-[1.5]" /></button>
            <button className="text-neutral-500 hover:text-[#2196F3] transition"><Mail size={24} className="stroke-[1.5]" /></button>

            {/* Profile Avatar & Hover Capsule */}
            <div className="relative group">
              <Link href={`/profile/${currentUsername}`}>
                <div className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-neutral-200 text-neutral-500 group-hover:border-[#2196F3] transition ml-2 bg-white shadow-sm overflow-hidden cursor-pointer relative">
                  {currentUserAvatar ? (
                     <Image src={currentUserAvatar} alt="Nav Avatar" width={42} height={42} className="object-cover w-full h-full" />
                  ) : (
                    <User size={22} className="stroke-[1.5] group-hover:text-[#2196F3]" />
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

        <main className="p-10 pt-2 max-w-2xl mx-auto w-full pb-32">
          <div className="flex flex-col gap-10">
            {loading && <div className="flex justify-center items-center h-40"><span className="text-lg font-medium text-neutral-600 animate-pulse font-general-sans">Loading the Feed...</span></div>}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
                <p className="font-semibold text-lg mb-1 font-satoshi">Could not load posts</p>
                <p className="text-sm font-general-sans">{error}</p>
              </div>
            )}
            {!loading && !error && posts.length > 0 && (
              <div className="flex flex-col gap-10">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
            {!loading && !error && posts.length === 0 && (
              <div className="flex justify-center items-center h-40">
                <span className="text-lg font-medium text-neutral-600 font-general-sans">No posts in the feed yet.</span>
              </div>
            )}
          </div>
        </main>
      </div>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-12 w-16 h-16 bg-[#2196F3] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(33,150,243,0.35)] hover:bg-[#1E88E5] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgb(33,150,243,0.45)] transition-all duration-300 z-50 group">
        <Pen size={26} className="stroke-[2] group-hover:scale-110 transition-transform duration-300" />
      </button>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchPosts} />
      
      {showProfilePrompt && <ProfileSetupPrompt />}
    </div>
  );
}