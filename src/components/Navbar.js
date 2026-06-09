"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Globe, 
  BarChart2, 
  Info, 
  FileCode2,
  Sparkles,
  BookOpen
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/public", label: "Public Feed", icon: Globe, badge: "ISR" },
    { href: "/stats", label: "Live Stats", icon: BarChart2, badge: "SSR" },
    { href: "/about", label: "Tech Stack", icon: Info, badge: "SSG" },
    { href: "/comparison", label: "API vs Actions", icon: FileCode2 }
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary-glow border border-primary/20 p-2 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide text-zinc-100">
              Emerald<span className="text-primary">Notes</span>
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Class Project v1.0</p>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex flex-col gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group border ${
                  isActive
                    ? "bg-primary-glow border-primary/20 text-primary font-medium shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                  <span className="text-sm">{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded border ${
                    isActive 
                      ? "bg-primary/10 border-primary/30 text-primary-light" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t border-zinc-800/80 pt-4 mt-auto">
        <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/50 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-warning" />
            <span>Learning Concepts</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Covers App Router, SSR, SSG, ISR, API Routes, Mongoose, and Server Actions.
          </p>
        </div>
      </div>
    </aside>
  );
}
