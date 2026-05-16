import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Send } from 'lucide-react';

export default function CreatePostModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  // If modal is closed, don't render anything
  if (!isOpen) return null;

  // Handle image selection and generate a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit the post to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Backend rule: Must have title AND at least text or image
    if (!title.trim()) {
      setError('A title is required.');
      setLoading(false);
      return;
    }
    if (!textContent.trim() && !imageFile) {
      setError('Your post must contain either text or an image.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('huff_token');
      
      // FastAPI expects Form Data for file uploads
      const formData = new FormData();
      formData.append('title', title);
      if (textContent) formData.append('text_content', textContent);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set Content-Type, the browser automatically sets it for FormData with boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create post');
      }

      // Cleanup and close
      setTitle('');
      setTextContent('');
      clearImage();
      onSuccess(); // Triggers the feed to refresh
      onClose();   // Closes the modal
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-[550px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900 font-satoshi">Create New Post</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition bg-neutral-50 hover:bg-neutral-100 p-2 rounded-full"
          >
            <X size={20} className="stroke-[2]" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col p-8 gap-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-neutral-600 tracking-wide font-satoshi">Post Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a catchy title..." 
              className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 font-general-sans focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors"
              required
            />
          </div>

          {/* Text Content Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-neutral-600 tracking-wide font-satoshi">What's on your mind?</label>
            <textarea 
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Share your thoughts, ideas, or questions..." 
              rows={4}
              className="w-full px-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 font-general-sans focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors resize-none"
            />
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-neutral-600 tracking-wide font-satoshi">Attach Image</label>
            
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-2xl border border-neutral-200 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                   <button 
                     type="button" 
                     onClick={clearImage}
                     className="bg-white text-red-600 font-semibold px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-neutral-50 transition"
                   >
                     Remove Image
                   </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-neutral-300 rounded-2xl py-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 hover:border-[#2196F3] transition group"
              >
                <div className="bg-[#E3F2FD] p-3 rounded-full text-[#2196F3] group-hover:scale-110 transition">
                  <ImageIcon size={24} className="stroke-[1.5]" />
                </div>
                <p className="text-sm text-neutral-500 font-medium mt-2">
                  <span className="text-[#2196F3]">Upload a file</span> or drag and drop
                </p>
                <p className="text-xs text-neutral-400">PNG, JPG, GIF up to 10MB</p>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" 
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-2">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-sm hover:bg-neutral-50 transition disabled:opacity-50 font-satoshi"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#2196F3] text-white font-medium text-sm hover:bg-[#1E88E5] shadow-sm shadow-blue-500/30 transition flex items-center gap-2 disabled:opacity-70 font-satoshi"
            >
              {loading ? 'Posting...' : 'Post'}
              {!loading && <Send size={16} className="stroke-[2]" />}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}