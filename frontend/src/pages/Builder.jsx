import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowUp, Loader2, Code2, Eye, Github, Rocket,
  Plug, Copy, Check, ExternalLink, Sparkles, Monitor,
} from "lucide-react";
import api from "../lib/api";
import { useToast } from "../hooks/use-toast";
import Logo from "../components/Logo";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "../components/ui/dialog";

const WATERMARK = `
<a href="/" id="notion-badge" style="position:fixed;bottom:16px;right:16px;z-index:99999;display:flex;align-items:center;gap:7px;background:#fff;color:#000;padding:7px 12px;border-radius:9999px;font:500 12px/1 Inter,system-ui,sans-serif;text-decoration:none;box-shadow:0 4px 18px rgba(0,0,0,.12);border:1px solid #e6e6e6">
<span style="width:15px;height:15px;display:inline-flex;align-items:center;justify-content:center;background:#000;color:#fff;border-radius:4px;font:700 9px/1 Inter,system-ui,sans-serif">N</span>
Made with Notion</a>`;

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
  { name: "Resend", desc: "Send transactional emails", color: "#0075de" },
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
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f5f4]"><Loader2 className="h-7 w-7 animate-spin text-[#a39e98]" /></div>;
  }

  return (
    <div className="flex h-screen flex-col bg-[#f6f5f4]">
      <header className="flex items-center justify-between border-b border-[#e6e6e6] bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="flex h-8 w-8 items-center justify-center rounded-md text-[#615d59] hover:bg-[#f6f5f4]">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Logo size={22} showText={false} />
          <span className="max-w-[220px] truncate text-[14px] font-semibold text-black">{project.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-md border border-[#e6e6e6] px-3 py-1.5 text-[13px] font-medium text-[#31302e] hover:bg-[#f6f5f4]">
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
                    className="flex items-center gap-3 rounded-lg border border-[#e6e6e6] p-3 text-left transition-colors hover:border-[#0075de]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white" style={{ background: it.color }}>
                      {it.name[0]}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-black">{it.name}</p>
                      <p className="text-[12px] text-[#615d59]">{it.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <button onClick={pushGithub} className="flex items-center gap-1.5 rounded-md border border-[#e6e6e6] px-3 py-1.5 text-[13px] font-medium text-[#31302e] hover:bg-[#f6f5f4]">
            <Github className="h-4 w-4" /> {project.github_url ? "Synced" : "GitHub"}
          </button>
          <button onClick={publish} className="flex items-center gap-1.5 rounded-full bg-[#0075de] px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#005bab]">
            <Rocket className="h-4 w-4" /> {project.published_url ? "Published" : "Publish"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <aside className="flex w-[380px] flex-col border-r border-[#e6e6e6] bg-white">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#213183]">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <div className="rounded-xl rounded-tl-sm bg-[#f6f5f4] px-3.5 py-2.5 text-[14px] text-[#31302e]">
                I've built your first version! Ask me to change anything — colors, text, layout, add sections.
              </div>
            </div>

            {(project.messages || []).map((m, i) => (
              <div key={i} className="flex justify-end gap-3">
                <div className="rounded-xl rounded-tr-sm bg-[#0075de] px-3.5 py-2.5 text-[14px] text-white">{m.content}</div>
              </div>
            ))}

            {generating && (
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#213183]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
                <div className="flex items-center gap-2 rounded-xl rounded-tl-sm bg-[#f6f5f4] px-3.5 py-2.5 text-[14px] text-[#615d59]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Building your changes...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-[#e6e6e6] p-3">
            <div className="rounded-xl border border-[#e6e6e6] p-2 focus-within:border-[#0075de]">
              <textarea rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); iterate(); } }}
                placeholder="Ask Notion to change something..."
                className="no-scrollbar w-full resize-none bg-transparent px-2 pt-1 text-[14px] outline-none placeholder-[#a39e98]" />
              <div className="flex justify-end">
                <button disabled={generating || !prompt.trim()} onClick={iterate}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0075de] text-white transition-transform hover:scale-105 active:scale-90 disabled:opacity-40">
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Preview / Code */}
        <main className="flex flex-1 flex-col bg-[#f6f5f4]">
          <div className="flex items-center justify-between border-b border-[#e6e6e6] bg-white px-4 py-2">
            <div className="flex items-center gap-1 rounded-md bg-[#f6f5f4] p-1">
              <button onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-[13px] font-medium transition-colors ${tab === "preview" ? "bg-white text-black shadow-soft" : "text-[#615d59]"}`}>
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-[13px] font-medium transition-colors ${tab === "code" ? "bg-white text-black shadow-soft" : "text-[#615d59]"}`}>
                <Code2 className="h-4 w-4" /> Code
              </button>
            </div>
            <div className="flex items-center gap-2">
              {project.published_url && (
                <a href={`https://${project.published_url.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-[12px] font-medium text-[#1aae39]">
                  <ExternalLink className="h-3.5 w-3.5" /> {project.published_url.replace(/^https?:\/\//, "")}
                </a>
              )}
              {tab === "code" && (
                <button onClick={copyCode} className="flex items-center gap-1.5 rounded-md border border-[#e6e6e6] px-2.5 py-1.5 text-[12px] font-medium text-[#615d59] hover:bg-[#f6f5f4]">
                  {copied ? <Check className="h-3.5 w-3.5 text-[#1aae39]" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-4">
            {tab === "preview" ? (
              <div className="h-full overflow-hidden rounded-xl border border-[#e6e6e6] bg-white shadow-soft">
                <div className="flex items-center gap-1.5 border-b border-[#e6e6e6] bg-[#f6f5f4] px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 flex items-center gap-1 text-[11px] text-[#a39e98]"><Monitor className="h-3 w-3" /> preview</span>
                </div>
                {generating && !project.code ? (
                  <div className="flex h-[calc(100%-33px)] flex-col items-center justify-center gap-4 bg-[#213183]">
                    <span className="relative flex h-16 w-16 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-2xl bg-[#62aef0]/40" />
                      <Logo size={48} light showText={false} />
                    </span>
                    <p className="text-[15px] font-medium text-white">Notion is building your app...</p>
                    <p className="text-[13px] text-white/60">This usually takes 30–90 seconds</p>
                  </div>
                ) : (
                  <iframe title="preview" srcDoc={injectWatermark(project.code)} className="h-[calc(100%-33px)] w-full" sandbox="allow-scripts allow-same-origin allow-forms" />
                )}
              </div>
            ) : (
              <pre className="no-scrollbar h-full overflow-auto rounded-xl border border-[#e6e6e6] bg-[#1e1e1e] p-4 text-[12.5px] leading-relaxed text-[#e6e6e6]">
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
