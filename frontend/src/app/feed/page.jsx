'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Mail, User } from 'lucide-react'; // Imported User icon, removed next/image
import Sidebar from '../../components/Sidebar';
import PostCard from '../../components/PostCard';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
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
    }

    fetchPosts();
  }, [router]);

  return (
    <div className="flex bg-neutral-100 min-h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area (Top Bar + Main Feed) */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Bar */}
        <header className="h-[80px] w-full flex items-center justify-end px-10">
          <div className="flex items-center gap-6">
            {/* Notification Bell Icon */}
            <button className="text-neutral-500 hover:text-[#2196F3] transition">
              <Bell size={24} className="stroke-[1.5]" />
            </button>
            
            {/* Messages/DM Icon */}
            <button className="text-neutral-500 hover:text-[#2196F3] transition">
              <Mail size={24} className="stroke-[1.5]" />
            </button>

            {/* Profile Avatar (Lucide React Icon in a perfect circle) */}
            <button className="flex items-center justify-center w-[42px] h-[42px] rounded-full border border-neutral-200 text-neutral-500 hover:text-[#2196F3] hover:border-[#2196F3] transition ml-2 bg-white shadow-sm">
              <User size={22} className="stroke-[1.5]" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-10 pt-2 max-w-2xl mx-auto w-full">
          <div className="flex flex-col gap-10">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-40">
                <span className="text-lg font-medium text-neutral-600 animate-pulse">Loading the Feed...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
                <p className="font-semibold text-lg mb-1">Could not load posts</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Render Posts */}
            {!loading && !error && posts.length > 0 && (
              <div className="flex flex-col gap-10">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && posts.length === 0 && (
              <div className="flex justify-center items-center h-40">
                <span className="text-lg font-medium text-neutral-600">No posts in the feed yet.</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}