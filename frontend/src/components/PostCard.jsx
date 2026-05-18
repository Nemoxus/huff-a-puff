import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatRelativeTime } from '../utils/formatTime';
import { Heart, MessageCircle } from 'lucide-react'; 
import Comments from './Comments'; 

export default function PostCard({ post }) {
  const hasText = post.text_content && post.text_content.trim() !== '';

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);
  
  const [showComments, setShowComments] = useState(false);
  
  // THE FIX: We moved the comments memory up to the parent!
  const [comments, setComments] = useState(post.comments || []);

  useEffect(() => {
    const currentUsername = localStorage.getItem('huff_username');
    if (currentUsername && post.liked_by_users?.includes(currentUsername)) {
      setIsLiked(true);
    }
  }, [post]);

  const handleLike = async () => {
    if (isLiking) return; 

    const originalIsLiked = isLiked;
    const originalCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount((prev) => Math.max(0, isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);

    try {
      const token = localStorage.getItem('huff_token');
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to toggle like");
      const data = await response.json();
      setIsLiked(data.liked); 
    } catch (err) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="relative w-full">
      <div 
        className="w-full transition-transform duration-500 ease-out"
        style={{ transform: showComments ? 'translateX(-200px)' : 'translateX(0)' }}
      >
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col gap-5 w-full">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight leading-tight font-satoshi">
              {post.title}
            </h2>
            <span className="text-sm font-medium text-neutral-500 whitespace-nowrap pt-1">
              {formatRelativeTime(post.created_at)}
            </span>
          </div>

          {hasText && (
            <p className="text-neutral-700 text-[17px] leading-relaxed font-general-sans font-light">
              {post.text_content}
            </p>
          )}

          {post.image_url && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-neutral-100 mt-1">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-4 mt-1">
            <div className="border-t border-neutral-100" />
            <div className="flex items-center gap-8">
              
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`transition group ${isLiked ? 'text-[#2196F3]' : 'text-neutral-400 hover:text-neutral-700'}`}
                >
                  <Heart 
                    size={22} 
                    className={`stroke-[2.25] transition-all duration-300 ${isLiked ? 'scale-110' : 'group-hover:scale-110'}`} 
                    fill={isLiked ? '#2196F3' : 'transparent'} 
                    stroke={isLiked ? '#2196F3' : 'currentColor'}
                  />
                </button>
                {likesCount > 0 && (
                  <span className={`text-base font-semibold pt-0.5 transition-colors ${isLiked ? 'text-[#2196F3]' : 'text-neutral-500'}`}>
                    {likesCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className={`transition group ${showComments ? 'text-[#2196F3]' : 'text-neutral-400 hover:text-[#2196F3]'}`}
                >
                  <MessageCircle 
                    size={22} 
                    className={`stroke-[2.25] transition-all duration-300 ${showComments ? 'fill-blue-50' : 'group-hover:scale-110'}`} 
                  />
                </button>
                {/* THE FIX: We now use the local 'comments' state length! */}
                {comments.length > 0 && (
                  <span className={`text-base font-semibold pt-0.5 transition-colors ${showComments ? 'text-[#2196F3]' : 'text-neutral-500'}`}>
                    {comments.length}
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>

        {showComments && (
          <Comments 
            postId={post._id} 
            comments={comments}       // Pass the memory down
            setComments={setComments} // Pass the ability to update the memory down
            onClose={() => setShowComments(false)} 
          />
        )}

      </div>
    </div>
  );
}