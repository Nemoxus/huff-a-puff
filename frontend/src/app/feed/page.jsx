'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Mail, User, Pen } from 'lucide-react'; 
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';
import CreatePostModal from '../../components/CreatePostModal'; // Imported the new modal

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  const router = useRouter();

  // Wrapped fetch logic in useCallback so we can call it after a successful post
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

  // Initial fetch on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex bg-neutral-100 min-h-screen relative">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area (Top Bar + Main Feed) */}
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
            <button className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-neutral-200 text-neutral-500 hover:text-[#2196F3] hover:border-[#2196F3] transition ml-2 bg-white shadow-sm">
              <User size={22} className="stroke-[1.5]" />
            </button>
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

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)} // Opens the modal
        className="fixed bottom-10 right-12 w-16 h-16 bg-[#2196F3] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(33,150,243,0.35)] hover:bg-[#1E88E5] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgb(33,150,243,0.45)] transition-all duration-300 z-50 group"
      >
        <Pen size={26} className="stroke-[2] group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* The Modal Component */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPosts} // Passing the fetch function so it auto-refreshes!
      />

    </div>
  );
}