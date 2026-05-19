'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Mail, User, Pen, LogOut } from 'lucide-react'; 
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import CreatePostModal from '../../components/CreatePostModal'; 

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const router = useRouter();
  const profileMenuRef = useRef(null);

  // --- CLICK OUTSIDE LISTENER ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- LOGOUT HANDLER ---
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
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex bg-neutral-100 min-h-screen relative">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        
        {/* Top Bar */}
        <header className="h-[80px] w-full flex items-center justify-end px-10">
          <div className="flex items-center gap-6">
            <button className="text-neutral-500 hover:text-[#2196F3] transition">
              <Bell size={24} className="stroke-[1.5]" />
            </button>
            <button className="text-neutral-500 hover:text-[#2196F3] transition">
              <Mail size={24} className="stroke-[1.5]" />
            </button>

            {/* Profile Avatar & Dropdown Wrapper */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-neutral-200 text-neutral-500 hover:text-[#2196F3] hover:border-[#2196F3] transition ml-2 bg-white shadow-sm"
              >
                <User size={22} className="stroke-[1.5]" />
              </button>

              {/* The Logout Capsule */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-[52px] bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full p-1 animate-in fade-in slide-in-from-top-1 zoom-in-95 duration-200 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-5 py-2 text-[13.5px] font-semibold text-neutral-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors font-satoshi whitespace-nowrap"
                  >
                    <LogOut size={16} className="stroke-[2]" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-10 pt-2 max-w-2xl mx-auto w-full pb-32">
          <div className="flex flex-col gap-10">
            {loading && (
              <div className="flex justify-center items-center h-40">
                <span className="text-lg font-medium text-neutral-600 animate-pulse font-general-sans">Loading the Feed...</span>
              </div>
            )}

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

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-12 w-16 h-16 bg-[#2196F3] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(33,150,243,0.35)] hover:bg-[#1E88E5] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgb(33,150,243,0.45)] transition-all duration-300 z-50 group"
      >
        <Pen size={26} className="stroke-[2] group-hover:scale-110 transition-transform duration-300" />
      </button>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPosts} 
      />

    </div>
  );
}