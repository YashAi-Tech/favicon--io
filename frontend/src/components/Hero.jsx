import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { heroSuggestions, stickerColors } from "../mock/mock";
import { useAuth } from "../context/AuthContext";

// Decorative "sticker constellation" — small colored dots, decoration only.
const Starfield = () => {
  const stars = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      arr.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        color: Math.random() > 0.7 ? stickerColors[Math.floor(Math.random() * stickerColors.length)] : "#ffffff",
      });
    }
    return arr;
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full"
          style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            background: s.color, animationDelay: `${s.delay}s`,
            boxShadow: `0 0 6px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
};

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
    <section id="top" className="relative overflow-hidden bg-[#213183] pt-36 pb-28 lg:pt-44 lg:pb-36">
      <Starfield />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#1b2a70]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <div className="animate-float-up mx-auto mb-6 flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.125px] text-white backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[#62aef0]" />
          Meet the night shift — build while you sleep
        </div>

        <h1 className="animate-float-up track-display1 text-[42px] font-bold leading-[1.02] text-white sm:text-6xl lg:text-[64px]">
          One workspace.<br />Every idea, built.
        </h1>
        <p className="animate-float-up mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/70">
          Describe a product, internal tool, or website in plain language. favicon.io's AI builds it, live, with you.
        </p>

        {/* Elevated white prompt pill */}
        <div className="animate-float-up mx-auto mt-10 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white p-2.5 shadow-elev">
            <textarea
              ref={taRef} rows={2} value={prompt} onChange={autoGrow}
              placeholder={`Ask favicon.io to create ${heroSuggestions[placeholderIdx]}...`}
              className="no-scrollbar w-full resize-none bg-transparent px-3 pt-2 text-[16px] leading-relaxed text-black placeholder-[#a39e98] outline-none"
            />
            <div className="flex items-center justify-between px-1 pt-1">
              <button className="flex h-9 w-9 items-center justify-center rounded-md text-[#615d59] transition-colors hover:bg-[#f6f5f4]" title="Attach">
                <Paperclip className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={handleBuild}
                className="flex h-10 items-center gap-1.5 rounded-full bg-[#0075de] px-5 text-[16px] font-medium text-white transition-all duration-150 hover:bg-[#005bab] active:scale-90"
              >
                Build <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {heroSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(`Create ${s}`)}
                className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
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
