import { Info, Cpu, Database, Palette, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Tech Stack & Architecture | SSG Demonstration",
  description: "Static page demonstrating Static Site Generation in Next.js and detailing project technologies.",
};

export default function AboutPage() {
  const techs = [
    {
      title: "Next.js App Router (v16)",
      desc: "Leverages React Server Components (RSC) for optimized payload delivery and instant initial loads. Implements file-based layouts, route handlers, and server actions.",
      icon: Cpu,
      badge: "Framework",
    },
    {
      title: "MongoDB & Mongoose",
      desc: "NoSQL document database connection using mongoose schemas with automated models caching. Connects securely via connection pooling to handle hot-reloads.",
      icon: Database,
      badge: "Database",
    },
    {
      title: "Tailwind CSS v4",
      desc: "Styled with Tailwind CSS v4 utilizing CSS-first themes. The palette relies on dark zinc/obsidian shades, glowing emerald borders, and golden amber accents.",
      icon: Palette,
      badge: "Styling",
    },
  ];

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto flex flex-col gap-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-primary font-bold tracking-widest uppercase">
          <Info className="w-4 h-4" />
          <span>Static Site Generation (SSG)</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Tech Stack & <span className="text-primary">Concepts</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
          This page was generated during build time. Static Site Generation (SSG) provides extremely fast loading times and optimized SEO performance by delivering pre-compiled HTML.
        </p>
      </div>

      {/* Grid of Tech */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techs.map((tech) => {
          const Icon = tech.icon;
          return (
            <div
              key={tech.title}
              className="glass-panel p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_10px_20px_rgba(16,185,129,0.05)]"
            >
              <div className="flex justify-between items-center">
                <div className="bg-primary-glow border border-primary/20 p-2.5 rounded-xl text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
                  {tech.badge}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">{tech.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{tech.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Concept Breakdown */}
      <div className="glass-panel p-8 rounded-3xl border border-zinc-800 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-warning" />
          <span>Understanding SSG vs. SSR vs. ISR</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-primary-light">SSG (Static Site Gen)</h4>
            <p className="text-zinc-400 leading-relaxed">
              HTML is compiled once during build. Delivered immediately to clients. Best for marketing pages, documentation, and blogs. (Demonstrated by this page).
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-warning-light">ISR (Incremental Static)</h4>
            <p className="text-zinc-400 leading-relaxed">
              Statically compiled but re-generated in the background when requested, after a set timer. Keeps pages blazing fast while remaining fresh. (Demonstrated by the Public Feed).
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-danger-light">SSR (Server Side Render)</h4>
            <p className="text-zinc-400 leading-relaxed">
              HTML is generated dynamically on the server for each user request. Best for user dashboards, checkout feeds, and analytics pages. (Demonstrated by the Live Stats page).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
