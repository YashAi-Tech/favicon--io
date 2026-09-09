import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Plus, Trash2, Loader2, LogOut, ArrowUp, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { useToast } from "../hooks/use-toast";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
          <Heart className="h-6 w-6 fill-[url(#dashgrad)] text-transparent" strokeWidth={0} />
          <svg width="0" height="0"><defs>
            <linearGradient id="dashgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff7a2f" /><stop offset="50%" stopColor="#ff5b8a" /><stop offset="100%" stopColor="#a855f7" />
            </linearGradient></defs></svg>
          <span className="text-[18px] font-semibold text-neutral-900">Lovable</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden text-[14px] text-neutral-500 sm:inline">{user?.name}</span>
          {user?.picture ? (
            <img src={user.picture} alt="me" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-purple-400 text-[13px] font-semibold uppercase text-white">
              {user?.name?.[0] || "U"}
            </span>
          )}
          <button onClick={() => { logout(); navigate("/"); }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" title="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
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
    setProjects((p) => p.filter((x) => x.id !== id));
    toast({ title: "Project deleted" });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100 blur-2xl" />
          <h1 className="relative text-3xl font-bold tracking-tight text-neutral-900">
            Hey {user?.name?.split(" ")[0] || "there"} 👋 what will you build?
          </h1>
          <p className="relative mt-2 text-[15px] text-neutral-500">Describe an app or website and Lovable will generate it.</p>

          <div className="relative mt-6 rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-sm focus-within:border-neutral-400">
            <textarea rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Lovable to create a landing page for my coffee shop..."
              className="no-scrollbar w-full resize-none bg-transparent px-3 pt-2 text-[15px] outline-none placeholder-neutral-400" />
            <div className="flex justify-end">
              <button disabled={creating || !prompt.trim()} onClick={() => createProject()}
                className="flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-50">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Build <ArrowUp className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-neutral-400" />
          <h2 className="text-[18px] font-semibold text-neutral-900">My Projects</h2>
          <span className="text-[14px] text-neutral-400">({projects.length})</span>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-neutral-400" /></div>
        ) : projects.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
            <Plus className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-3 text-[15px] text-neutral-500">No projects yet. Build your first one above!</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} onClick={() => navigate(`/build/${p.id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50">
                  <Heart className="h-10 w-10 fill-[url(#dashgrad)] text-transparent opacity-70" strokeWidth={0} />
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-neutral-900">{p.name}</p>
                    <p className="text-[12px] text-neutral-400">
                      {new Date(p.updated_at).toLocaleDateString()}
                      {p.published_url && <span className="ml-2 text-emerald-500">● Live</span>}
                    </p>
                  </div>
                  <button onClick={(e) => remove(p.id, e)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
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
