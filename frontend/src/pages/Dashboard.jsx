import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Loader2, LogOut, ArrowUp, LayoutGrid, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { useToast } from "../hooks/use-toast";
import Logo from "../components/Logo";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-[#e6e6e6] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <button onClick={() => navigate("/dashboard")}>
          <Logo size={24} />
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden text-[14px] text-[#615d59] sm:inline">{user?.name}</span>
          {user?.picture ? (
            <img src={user.picture} alt="me" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#111111] text-[13px] font-semibold uppercase text-white">
              {user?.name?.[0] || "U"}
            </span>
          )}
          <button onClick={() => { logout(); navigate("/"); }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#615d59] hover:bg-[#faf8f5] hover:text-black" title="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

const stickerFor = (id) => {
  const colors = ["#62aef0", "#d6b6f6", "#ff64c8", "#dd5b00", "#2a9d99", "#1aae39"];
  let h = 0; for (const c of id) h = (h + c.charCodeAt(0)) % colors.length;
  return colors[h];
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const load = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const pending = localStorage.getItem("lovable_pending_prompt");
    if (pending) {
      localStorage.removeItem("lovable_pending_prompt");
      createProject(pending);
    }
    // eslint-disable-next-line
  }, []);

  const createProject = async (p) => {
    const text = (p || prompt).trim();
    if (!text) return;
    setCreating(true);
    try {
      const res = await api.post("/projects/generate", { prompt: text });
      navigate(`/build/${res.data.id}`);
    } catch (e) {
      toast({ title: "Generation failed", description: e?.response?.data?.detail || "Try again." });
      setCreating(false);
    }
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    await api.delete(`/projects/${id}`);
    setProjects((pp) => pp.filter((x) => x.id !== id));
    toast({ title: "Project deleted" });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-xl border border-[#e6e6e6] bg-white p-8 shadow-soft">
          <h1 className="track-h2 text-[26px] font-bold text-black">
            Hey {user?.name?.split(" ")[0] || "there"}, what will you build?
          </h1>
          <p className="mt-2 text-[15px] text-[#615d59]">Describe an app or website and favicon.io will generate it.</p>

          <div className="mt-6 rounded-xl border border-[#e6e6e6] bg-white p-2.5 focus-within:border-[#f9540b]">
            <textarea rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask favicon.io to create a landing page for my coffee shop..."
              className="no-scrollbar w-full resize-none bg-transparent px-3 pt-2 text-[15px] outline-none placeholder-[#a39e98]" />
            <div className="flex justify-end">
              <button disabled={creating || !prompt.trim()} onClick={() => createProject()}
                className="flex h-9 items-center gap-1.5 rounded-full bg-[#f9540b] px-4 text-[15px] font-medium text-white transition-all hover:bg-[#d9430a] active:scale-90 disabled:opacity-50">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Build <ArrowUp className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-[#a39e98]" />
          <h2 className="track-h3 text-[20px] font-bold text-black">My Projects</h2>
          <span className="text-[14px] text-[#a39e98]">({projects.length})</span>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#a39e98]" /></div>
        ) : projects.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[#e6e6e6] bg-white py-16 text-center">
            <Plus className="mx-auto h-8 w-8 text-[#a39e98]" />
            <p className="mt-3 text-[15px] text-[#615d59]">No projects yet. Build your first one above!</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} onClick={() => navigate(`/build/${p.id}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-[#e6e6e6] bg-white transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="flex h-32 items-center justify-center" style={{ background: stickerFor(p.id) + "22" }}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg text-white" style={{ background: stickerFor(p.id) }}>
                    <FileText className="h-6 w-6" />
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-black">{p.name}</p>
                    <p className="text-[12px] text-[#a39e98]">
                      {new Date(p.updated_at).toLocaleDateString()}
                      {p.status === "generating" && <span className="ml-2 text-[#f9540b]">● Building</span>}
                      {p.published_url && <span className="ml-2 text-[#1aae39]">● Live</span>}
                    </p>
                  </div>
                  <button onClick={(e) => remove(p.id, e)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#a39e98] opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
