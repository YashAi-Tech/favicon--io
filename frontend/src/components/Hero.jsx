import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Paperclip, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { heroSuggestions } from "../mock/mock";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const [prompt, setPrompt] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const taRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % heroSuggestions.length);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const handleBuild = () => {
    const idea = prompt.trim() || `Create ${heroSuggestions[placeholderIdx]}`;
    localStorage.setItem("lovable_pending_prompt", idea);
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const autoGrow = (e) => {
    setPrompt(e.target.value);
    const el = taRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  };

  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-24 lg:pt-48 lg:pb-32">
      {/* soft gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="lov-blob animate-pulse-glow absolute -top-20 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-300 via-rose-300 to-purple-300" />
        <div className="lov-blob absolute right-10 top-40 h-72 w-72 rounded-full bg-purple-200" />
        <div className="lov-blob absolute left-0 top-56 h-64 w-64 rounded-full bg-orange-200" />
      </div>

      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <div className="animate-float-up mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-neutral-600 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-rose-500" />
          Introducing the all-new AI App Builder
        </div>

        <h1 className="animate-float-up text-[44px] font-extrabold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
          Build something <span className="lov-gradient-text">Lovable</span>
        </h1>
        <p className="animate-float-up mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-neutral-500">
          Bring a new product, internal tool, or entire company to life. If you can describe it, you can build it.
        </p>

        {/* Prompt box */}
        <div className="animate-float-up mx-auto mt-9 max-w-2xl">
          <div className="rounded-[22px] border border-neutral-200 bg-white p-2.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-shadow focus-within:shadow-[0_24px_70px_-15px_rgba(168,85,247,0.28)]">
            <textarea
              ref={taRef}
              rows={2}
              value={prompt}
              onChange={autoGrow}
              placeholder={`Ask Lovable to create ${heroSuggestions[placeholderIdx]}...`}
              className="no-scrollbar w-full resize-none bg-transparent px-3 pt-2 text-[16px] leading-relaxed text-neutral-800 placeholder-neutral-400 outline-none"
            />
            <div className="flex items-center justify-between px-1 pt-1">
              <div className="flex items-center gap-1">
                <button className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700" title="Attach">
                  <Paperclip className="h-[18px] w-[18px]" />
                </button>
                <button className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700" title="Public">
                  <Globe className="h-[18px] w-[18px]" />
                  Public
                </button>
              </div>
              <button
                onClick={handleBuild}
                className="flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-[14px] font-semibold text-white transition-transform duration-200 hover:scale-[1.04] hover:bg-neutral-800 active:scale-95"
              >
                Build
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {heroSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(`Create ${s}`)}
                className="rounded-full border border-neutral-200 bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-neutral-600 backdrop-blur transition-colors hover:border-neutral-300 hover:text-neutral-900"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
