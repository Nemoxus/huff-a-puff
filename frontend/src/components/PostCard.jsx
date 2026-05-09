import Image from 'next/image';
import { formatRelativeTime } from '../utils/formatTime';
import { Heart } from 'lucide-react'; 

export default function PostCard({ post }) {
  const hasText = post.text_content && post.text_content.trim() !== '';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col gap-5">
      {/* Post Header: Title and Time */}
      <div className="flex items-start justify-between gap-4">
        {/* Applied font-satoshi here */}
        <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight leading-tight font-satoshi">
          {post.title}
        </h2>
        <span className="text-sm font-medium text-neutral-500 whitespace-nowrap pt-1">
          {formatRelativeTime(post.created_at)}
        </span>
      </div>

      {/* Post Content: Text */}
      {hasText && (
        // Applied font-general-sans and made it thin/light
        <p className="text-neutral-700 text-[17px] leading-relaxed font-general-sans font-light">
          {post.text_content}
        </p>
      )}

      {/* Post Content: Image (Optional) */}
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

      {/* Post Footer: Separator and Likes */}
      <div className="flex flex-col gap-4 mt-1">
        <div className="border-t border-neutral-100" />
        <div className="flex items-center gap-2.5 text-neutral-600">
          <button className="hover:text-neutral-900 transition">
            <Heart size={21} className="stroke-[2.25]" />
          </button>
          <span className="text-base font-semibold pt-0.5">
            {post.likes_count}
          </span>
        </div>
      </div>
    </div>
  );
}