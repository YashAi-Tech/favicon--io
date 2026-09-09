import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Paperclip, Sparkles } from "lucide-react";
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
    const t = setInterval(() => setPlaceholderIdx((i) => (i + 1) % heroSuggestions.length), 2600);
    return () => clearInterval(t);
  }, []);

  const handleBuild = () => {
    const idea = prompt.trim() || `Create ${heroSuggestions[placeholderIdx]}`;
    localStorage.setItem("lovable_pending_prompt", idea);
    navigate(user ? "/dashboard" : "/signup");
  };

  const autoGrow = (e) => {
    setPrompt(e.target.value);
    const el = taRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 200) + "px"; }
  };

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      {/* clean warm backdrop */}
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(249,84,11,0.14),transparent_70%)]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <div className="animate-float-up mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-[#ecdfd4] bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-[#8a5a3a] backdrop-blur">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f9540b]">
            <Sparkles className="h-2.5 w-2.5 text-white" />
          </span>
          Introducing the AI app builder
        </div>

        <h1 className="animate-float-up track-display1 text-[44px] font-extrabold leading-[0.98] text-[#1b1a18] sm:text-6xl lg:text-[72px]">
          Ship your idea<br />
          <span className="relative inline-block">
            <span className="relative z-10">in minutes</span>
            <span className="absolute inset-x-0 bottom-1.5 -z-0 h-4 -rotate-1 bg-[#ffd9c7]" />
          </span>
          , not months.
        </h1>
        <p className="animate-float-up mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-[#615d59]">
          Describe an app, internal tool, or website in plain language. favicon.io builds it, live, with you.
        </p>

        {/* prompt card */}
        <div className="animate-float-up mx-auto mt-10 max-w-2xl">
          <div className="rounded-2xl border border-[#ece6df] bg-white p-2.5 shadow-elev transition-shadow focus-within:shadow-glow">
            <textarea
              ref={taRef} rows={2} value={prompt} onChange={autoGrow}
              placeholder={`Ask favicon.io to create ${heroSuggestions[placeholderIdx]}...`}
              className="no-scrollbar w-full resize-none bg-transparent px-3 pt-2 text-[16px] leading-relaxed text-[#1b1a18] placeholder-[#a39e98] outline-none"
            />
            <div className="flex items-center justify-between px-1 pt-1">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[#615d59] transition-colors hover:bg-[#faf8f5]" title="Attach">
                <Paperclip className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={handleBuild}
                className="flex h-10 items-center gap-1.5 rounded-full bg-[#f9540b] px-5 text-[15px] font-semibold text-white shadow-glow transition-all duration-150 hover:bg-[#d9430a] active:scale-95"
              >
                Build it <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {heroSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(`Create ${s}`)}
                className="rounded-full border border-[#ece6df] bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-[#615d59] backdrop-blur transition-colors hover:border-[#f9540b] hover:text-[#1b1a18]"
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
