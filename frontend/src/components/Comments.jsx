import { useState } from 'react';
import { User, Send, X } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatTime';

// THE FIX: Accept `comments` and `setComments` as props
export default function Comments({ postId, comments, setComments, onClose }) {
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isCommenting) return;

    const newCommentStr = commentText.trim();
    setCommentText(''); 
    setIsCommenting(true);

    const currentUsername = localStorage.getItem('huff_username') || 'You';

    const tempComment = {
      _id: `temp-${Date.now()}`,
      author_username: currentUsername,
      comment_text: newCommentStr, 
      text_content: newCommentStr,
      created_at: new Date().toISOString()
    };
    
    // Updates the memory in the PARENT component!
    setComments((prev) => [...prev, tempComment]);

    try {
      const token = localStorage.getItem('huff_token');
      
      const formData = new FormData();
      formData.append('comment_text', newCommentStr);

      const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        console.error("FastAPI Error:", errorData);
        
        const errorMessage = errorData.detail && Array.isArray(errorData.detail)
          ? `Backend expects field: '${errorData.detail[0]?.loc.join(' -> ')}'` 
          : (errorData.detail || "Server Error");
          
        throw new Error(errorMessage);
      }
      
    } catch (err) {
      console.error("Comment error:", err);
      alert(`API Error: ${err.message}`); 
      // Revert in the parent if failed
      setComments((prev) => prev.filter(c => c._id !== tempComment._id));
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="absolute top-0 left-[calc(100%+24px)] w-[400px] bg-white rounded-3xl shadow-md border border-neutral-100 flex flex-col overflow-hidden max-h-[550px] animate-in fade-in slide-in-from-left-8 duration-500 ease-out z-10">
      
      {/* Header */}
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between flex-shrink-0 bg-white">
        <h3 className="text-xl font-semibold text-neutral-900 font-satoshi">Comments</h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-800 transition">
          <X size={20} className="stroke-[2]" />
        </button>
      </div>
      
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 min-h-[200px]">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment._id || `comment-${index}`} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden text-neutral-400">
                <User size={16} className="stroke-[2]" />
              </div>
              <div className="flex flex-col bg-neutral-50 p-3.5 rounded-2xl rounded-tl-none w-full border border-neutral-100">
                <span className="text-[13px] font-semibold text-neutral-900 font-satoshi mb-1">
                  {comment.author_username || comment.username || comment.author || 'Huff-a-Puff User'}
                </span>
                <p className="text-[14px] text-neutral-900 font-general-sans leading-relaxed">
                  {comment.comment_text || comment.text_content || comment.content || comment.text || ''}
                </p>
                <span className="text-[11px] text-neutral-400 mt-2 font-medium">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-neutral-500 font-general-sans h-32">
            No comments yet. Be the first!
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="p-4 border-t border-neutral-100 bg-white flex-shrink-0">
        <form onSubmit={handleAddComment} className="flex items-center gap-3 relative">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full pl-5 pr-12 py-3 text-sm text-neutral-900 font-general-sans focus:outline-none focus:border-[#2196F3] focus:bg-white transition-colors placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={isCommenting || !commentText.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#2196F3] text-white p-2 rounded-full hover:bg-[#1E88E5] transition-colors disabled:opacity-50 disabled:hover:bg-[#2196F3] flex items-center justify-center shadow-sm"
          >
            <Send size={15} className="stroke-[2] -ml-0.5 mt-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}