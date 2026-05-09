import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, Compass, Link2, Share2 } from 'lucide-react';

const navItems = [
  { name: 'Feed', href: '/feed', icon: LayoutGrid },
  { name: 'Discover', href: '#', icon: Compass },
];

const shareItems = [
  { name: 'Copy Link', href: '#', icon: Link2 },
  { name: 'Share App', href: '#', icon: Share2 },
];

export default function Sidebar() {
  return (
    <aside className="w-80 bg-neutral-50 h-screen border-r border-neutral-100 flex flex-col p-8 pt-10 sticky top-0">
      {/* Logo & Title Section */}
      <div className="flex flex-col gap-2.5 mb-14">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Huff-a-Puff Logo" width={34} height={34} />
          <h1 className="text-[28px] font-light tracking-wide text-[#2196F3]">
            Huff-a-Puff
          </h1>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex flex-col gap-10">
        <ul className="flex flex-col gap-7">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center justify-between group">
                <div className="flex items-center gap-4 text-neutral-700 group-hover:text-neutral-950 transition">
                  <item.icon size={22} className="stroke-[2.25]" />
                  {/* Applied font-satoshi here */}
                  <span className="text-[17px] font-semibold pt-0.5 tracking-tight font-satoshi">{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Share Section */}
        <div className="flex flex-col gap-7 pt-12 border-t border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-500 tracking-wider uppercase">Pass the J ;)</h3>
            <ul className="flex flex-col gap-7">
              {shareItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="flex items-center gap-4 text-neutral-700 hover:text-neutral-950 transition group">
                    <item.icon size={22} className="stroke-[2.25]" />
                    {/* Applied font-satoshi here */}
                    <span className="text-[17px] font-semibold pt-0.5 tracking-tight font-satoshi">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
        </div>
      </nav>
    </aside>
  );
}