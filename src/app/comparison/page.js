"use client";

import { useState, useTransition } from "react";
import { createNoteAction } from "@/app/actions";
import { ArrowLeftRight, Code, Send, Terminal, Zap } from "lucide-react";

export default function ComparisonPage() {
  const [apiTitle, setApiTitle] = useState("");
  const [apiContent, setApiContent] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");

  const [apiLogs, setApiLogs] = useState([]);
  const [actionLogs, setActionLogs] = useState([]);

  const [apiPending, setApiPending] = useState(false);
  const [isPending, startTransition] = useTransition();

  const addApiLog = (msg) => setApiLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  const addActionLog = (msg) => setActionLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // Form A: Traditional API Route
  const handleApiSubmit = async (e) => {
    e.preventDefault();
    if (!apiTitle.trim() || !apiContent.trim()) return;

    setApiLogs([]);
    setApiPending(true);
    addApiLog("Form submission intercepted via client JavaScript.");
    addApiLog("e.preventDefault() called to block native browser page reload.");
    addApiLog("Serializing form inputs into a JSON payload.");
    
    const payload = {
      title: `${apiTitle} (via API)`,
      content: apiContent,
      tags: ["API-Route"],
    };

    addApiLog("Triggering standard fetch() POST request to '/api/notes'...");
    
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      addApiLog("Awaiting response headers and body parsing...");
      const data = await res.json();

      if (data.success) {
        addApiLog(`Response received: HTTP 201 (Created). Success: ${data.success}`);
        addApiLog(`Mongoose document inserted with ID: ${data.data._id}`);
        addApiLog("Resetting client state variables. Cache is still stale unless client triggers refresh.");
        setApiTitle("");
        setApiContent("");
      } else {
        addApiLog(`API Error response: ${data.error}`);
      }
    } catch (err) {
      addApiLog(`API call crashed: ${err.message}`);
    } finally {
      setApiPending(false);
    }
  };

  // Form B: Modern Server Action
  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionTitle.trim() || !actionContent.trim()) return;

    setActionLogs([]);
    addActionLog("Form submitted. Constructing FormData container.");
    
    const formData = new FormData();
    formData.append("title", `${actionTitle} (via Action)`);
    formData.append("content", actionContent);
    formData.append("tags", "Server-Action");

    addActionLog("Triggering Server Action invocation RPC...");
    
    startTransition(async () => {
      addActionLog("Entering React Transition state (isPending is true).");
      addActionLog("Invoking 'createNoteAction' bound to the server bundle.");
      
      const res = await createNoteAction(null, formData);
      
      if (res.success) {
        addActionLog(`Server completed write. Message: ${res.message}`);
        addActionLog("Cache invalidation triggered server-side via revalidatePath('/')!");
        addActionLog("UI will reflect updates automatically without full reload.");
        setActionTitle("");
        setActionContent("");
      } else {
        addActionLog(`Action error returned: ${res.error}`);
      }
    });
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto flex flex-col gap-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs text-primary font-bold tracking-widest uppercase">
          <Code className="w-4 h-4" />
          <span>Technical Architecture</span>
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-3">
          API Routes <ArrowLeftRight className="w-6 h-6 text-zinc-500" /> Server Actions
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl">
          Compare the two main communication paradigms in Next.js. Use the live forms below to watch execution events stream in real-time.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* API Routes Docs */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-zinc-100 font-bold text-lg border-b border-zinc-800 pb-3">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              <Code className="w-5 h-5" />
            </div>
            <h3>API Routes (Traditional)</h3>
          </div>
          <ul className="text-sm text-zinc-400 flex flex-col gap-3 list-disc pl-4">
            <li><strong>Protocol</strong>: Structured HTTP REST endpoints (GET, POST, etc.).</li>
            <li><strong>Best for</strong>: External clients, public webhooks, mobile apps, or headless integrations.</li>
            <li><strong>State Management</strong>: Manual JSON requests, parsing, and response mapping. Client must handle state tracking.</li>
            <li><strong>Caching</strong>: Requires manual client refetches, React Query invalidate, or router reloads to see new data.</li>
          </ul>
        </div>

        {/* Server Actions Docs */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary font-bold text-lg border-b border-zinc-800 pb-3">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <h3>Server Actions (RPC-based)</h3>
          </div>
          <ul className="text-sm text-zinc-400 flex flex-col gap-3 list-disc pl-4">
            <li><strong>Protocol</strong>: Direct Server RPCs triggered from client interactions or form submissions.</li>
            <li><strong>Best for</strong>: High-trust internal updates, direct form writes, and fast micro-interactions.</li>
            <li><strong>Progressive Enhancement</strong>: Works without client-side Javascript (using native HTML forms).</li>
            <li><strong>Caching</strong>: Seamless server-side integration. Triggers `revalidatePath()` to flush layouts instantly.</li>
          </ul>
        </div>
      </div>

      {/* Interactive Form Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Form A: API Route Form */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-850 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-zinc-200">Submit via API Route</h3>
            <p className="text-xs text-zinc-500 mt-1">Calls POST `/api/notes` using `fetch` client side</p>
          </div>

          <form onSubmit={handleApiSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-bold uppercase">Note Title</label>
              <input
                type="text"
                value={apiTitle}
                onChange={(e) => setApiTitle(e.target.value)}
                placeholder="Title (API)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-bold uppercase">Note Content</label>
              <textarea
                value={apiContent}
                onChange={(e) => setApiContent(e.target.value)}
                placeholder="Write note contents..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={apiPending}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {apiPending ? (
                <>
                  <div className="spinner" />
                  <span>Fetching API...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit to API</span>
                </>
              )}
            </button>
          </form>

          {/* API Log Console */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col gap-1.5 min-h-[160px] font-mono text-[11px] text-zinc-500 select-text">
            <div className="flex items-center gap-1.5 text-zinc-400 border-b border-zinc-900 pb-1.5 mb-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold">Client API Logs</span>
            </div>
            {apiLogs.length === 0 ? (
              <span className="text-zinc-650 italic">Submit note above to capture logs...</span>
            ) : (
              apiLogs.map((log, i) => <div key={i} className="leading-relaxed">{log}</div>)
            )}
          </div>
        </div>

        {/* Form B: Server Action Form */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-850 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-primary-light">Submit via Server Action</h3>
            <p className="text-xs text-zinc-500 mt-1">Calls `createNoteAction` inside React Transition</p>
          </div>

          <form onSubmit={handleActionSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-bold uppercase">Note Title</label>
              <input
                type="text"
                value={actionTitle}
                onChange={(e) => setActionTitle(e.target.value)}
                placeholder="Title (Server Action)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-bold uppercase">Note Content</label>
              <textarea
                value={actionContent}
                onChange={(e) => setActionContent(e.target.value)}
                placeholder="Write note contents..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <div className="spinner !border-l-white" />
                  <span>Executing Server Action...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit to Action</span>
                </>
              )}
            </button>
          </form>

          {/* Action Log Console */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col gap-1.5 min-h-[160px] font-mono text-[11px] text-zinc-500 select-text">
            <div className="flex items-center gap-1.5 text-primary-light border-b border-zinc-900 pb-1.5 mb-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold">Server Action Logs</span>
            </div>
            {actionLogs.length === 0 ? (
              <span className="text-zinc-650 italic">Submit note above to capture logs...</span>
            ) : (
              actionLogs.map((log, i) => <div key={i} className="leading-relaxed text-zinc-400">{log}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
