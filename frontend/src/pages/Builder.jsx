import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart, ArrowLeft, ArrowUp, Loader2, Code2, Eye, Github, Rocket,
  Plug, Copy, Check, ExternalLink, Sparkles, Monitor,
} from "lucide-react";
import api from "../lib/api";
import { useToast } from "../hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "../components/ui/dialog";

const WATERMARK = `
<a href="/" id="lovable-badge" style="position:fixed;bottom:16px;right:16px;z-index:99999;display:flex;align-items:center;gap:6px;background:#111;color:#fff;padding:7px 12px;border-radius:999px;font:600 12px/1 Inter,system-ui,sans-serif;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,.25)">
<span style="width:14px;height:14px;display:inline-block;background:linear-gradient(135deg,#ff7a2f,#ff5b8a,#a855f7);-webkit-mask:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path d=%22M12 21s-6.7-4.35-9.5-8.5C.5 9 2 5 5.5 5 7.8 5 9.2 6.5 12 9c2.8-2.5 4.2-4 6.5-4C22 5 23.5 9 21.5 12.5 18.7 16.65 12 21 12 21z%22/></svg>') center/contain no-repeat;mask:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path d=%22M12 21s-6.7-4.35-9.5-8.5C.5 9 2 5 5.5 5 7.8 5 9.2 6.5 12 9c2.8-2.5 4.2-4 6.5-4C22 5 23.5 9 21.5 12.5 18.7 16.65 12 21 12 21z%22/></svg>') center/contain no-repeat"></span>
Made with Lovable</a>`;

const injectWatermark = (code) => {
  if (!code) return "";
  if (code.includes("</body>")) return code.replace("</body>", WATERMARK + "</body>");
  return code + WATERMARK;
};

const INTEGRATIONS = [
  { name: "Supabase", desc: "Postgres database, auth & storage", color: "#3ECF8E" },
  { name: "GitHub", desc: "Sync your code to a repository", color: "#181717" },
  { name: "Stripe", desc: "Accept payments worldwide", color: "#635BFF" },
  { name: "OpenAI", desc: "Add AI features to your app", color: "#10A37F" },
  { name: "Resend", desc: "Send transactional emails", color: "#000000" },
  { name: "Vercel", desc: "Deploy to the edge", color: "#000000" },
];

const Builder = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("preview");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);

  const generating = project?.status === "generating";

  const load = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (e) {
      toast({ title: "Project not found" });
      navigate("/dashboard");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [projectId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [project?.messages, generating]);

  // Poll while the backend generates code (avoids ingress timeout)
  useEffect(() => {
    if (generating) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await api.get(`/projects/${projectId}`);
          setProject(res.data);
          if (res.data.status !== "generating") {
            clearInterval(pollRef.current);
            if (res.data.status === "ready") setTab("preview");
            if (res.data.status === "error") toast({ title: "Generation failed", description: res.data.error || "Try again." });
          }
        } catch (e) {}
      }, 2500);
    }
    return () => pollRef.current && clearInterval(pollRef.current);
    // eslint-disable-next-line
  }, [generating, projectId]);

  const iterate = async () => {
    const text = prompt.trim();
    if (!text || generating) return;
    setPrompt("");
    setProject((p) => ({ ...p, status: "generating", messages: [...(p.messages || []), { role: "user", content: text }] }));
    try {
      const res = await api.post("/projects/generate", { prompt: text, project_id: projectId });
      setProject(res.data);
    } catch (e) {
      toast({ title: "Generation failed", description: e?.response?.data?.detail || "Try again." });
      load();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(project?.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const pushGithub = async () => {
    try {
      const res = await api.post(`/projects/${projectId}/github`);
      setProject((p) => ({ ...p, github_url: res.data.github_url }));
      toast({ title: "Pushed to GitHub (simulated)", description: "Connect a real GitHub token to enable live sync." });
    } catch (e) { toast({ title: "Failed" }); }
  };

  const publish = async () => {
    try {
      const res = await api.post(`/projects/${projectId}/publish`);
      setProject((p) => ({ ...p, published_url: res.data.published_url }));
      toast({ title: "Published (simulated)", description: res.data.published_url });
    } catch (e) { toast({ title: "Failed" }); }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-neutral-400" /></div>;
  }

  return (
    <div className="flex h-screen flex-col bg-neutral-100">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Heart className="h-5 w-5 fill-[url(#bgrad)] text-transparent" strokeWidth={0} />
          <svg width="0" height="0"><defs>
            <linearGradient id="bgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff7a2f" /><stop offset="50%" stopColor="#ff5b8a" /><stop offset="100%" stopColor="#a855f7" />
            </linearGradient></defs></svg>
          <span className="max-w-[220px] truncate text-[14px] font-semibold text-neutral-800">{project.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">
                <Plug className="h-4 w-4" /> Integrations
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Connect integrations</DialogTitle>
                <DialogDescription>Supercharge your app. (Connecting requires your own API keys — simulated in this preview.)</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {INTEGRATIONS.map((it) => (
                  <button key={it.name} onClick={() => toast({ title: `${it.name} (simulated)`, description: "Add your own keys to connect for real." })}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 text-left transition-colors hover:border-neutral-400">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white" style={{ background: it.color }}>
                      {it.name[0]}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-900">{it.name}</p>
                      <p className="text-[12px] text-neutral-500">{it.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <button onClick={pushGithub} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">
            <Github className="h-4 w-4" /> {project.github_url ? "Synced" : "GitHub"}
          </button>
          <button onClick={publish} className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-neutral-800">
            <Rocket className="h-4 w-4" /> {project.published_url ? "Published" : "Publish"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <aside className="flex w-[380px] flex-col border-r border-neutral-200 bg-white">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-purple-400">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2.5 text-[14px] text-neutral-700">
                I've built your first version! Ask me to change anything — colors, text, layout, add sections.
              </div>
            </div>

            {(project.messages || []).map((m, i) => (
              <div key={i} className="flex justify-end gap-3">
                <div className="rounded-2xl rounded-tr-sm bg-neutral-900 px-3.5 py-2.5 text-[14px] text-white">{m.content}</div>
              </div>
            ))}

            {generating && (
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-purple-400">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2.5 text-[14px] text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Building your changes...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-neutral-200 p-3">
            <div className="rounded-2xl border border-neutral-200 p-2 focus-within:border-neutral-400">
              <textarea rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); iterate(); } }}
                placeholder="Ask Lovable to change something..."
                className="no-scrollbar w-full resize-none bg-transparent px-2 pt-1 text-[14px] outline-none placeholder-neutral-400" />
              <div className="flex justify-end">
                <button disabled={generating || !prompt.trim()} onClick={iterate}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform hover:scale-105 disabled:opacity-40">
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview / Code */}
        <main className="flex flex-1 flex-col bg-neutral-100">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2">
            <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-1">
              <button onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${tab === "preview" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${tab === "code" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>
                <Code2 className="h-4 w-4" /> Code
              </button>
            </div>
            <div className="flex items-center gap-2">
              {project.published_url && (
                <a href={`https://${project.published_url.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                  <ExternalLink className="h-3.5 w-3.5" /> {project.published_url.replace(/^https?:\/\//, "")}
                </a>
              )}
              {tab === "code" && (
                <button onClick={copyCode} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-4">
            {tab === "preview" ? (
              <div className="h-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-3 flex items-center gap-1 text-[11px] text-neutral-400"><Monitor className="h-3 w-3" /> preview</span>
                </div>
                {generating && !project.code ? (
                  <div className="flex h-[calc(100%-33px)] flex-col items-center justify-center gap-4 bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50">
                    <span className="relative flex h-16 w-16 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-rose-300/50" />
                      <Heart className="relative h-10 w-10 fill-[url(#bgrad)] text-transparent" strokeWidth={0} />
                    </span>
                    <p className="text-[15px] font-medium text-neutral-600">Lovable is building your app...</p>
                    <p className="text-[13px] text-neutral-400">This usually takes 30–90 seconds</p>
                  </div>
                ) : (
                  <iframe title="preview" srcDoc={injectWatermark(project.code)} className="h-[calc(100%-33px)] w-full" sandbox="allow-scripts allow-same-origin allow-forms" />
                )}
              </div>
            ) : (
              <pre className="no-scrollbar h-full overflow-auto rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-[12.5px] leading-relaxed text-neutral-200">
                <code>{project.code || "// Generating code..."}</code>
              </pre>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Builder;
