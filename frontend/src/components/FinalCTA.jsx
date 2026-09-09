import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FinalCTA = () => {
  const [prompt, setPrompt] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuild = () => {
    localStorage.setItem("lovable_pending_prompt", prompt.trim() || "Create a modern landing page");
    navigate(user ? "/dashboard" : "/signup");
  };

  return (
    <section id="pricing" className="relative overflow-hidden bg-neutral-950 py-28 lg:py-36">
      {/* pulse gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="animate-pulse-glow absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-500/30 via-rose-500/30 to-purple-600/30 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center lg:px-8">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Ready to bring your <span className="lov-gradient-text">idea</span> to life?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[17px] text-neutral-400">
          Start building for free. No credit card required.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-xl">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Lovable to create a blog about..."
              onKeyDown={(e) => e.key === "Enter" && handleBuild()}
              className="w-full bg-transparent px-3 py-3 text-[16px] text-white placeholder-neutral-500 outline-none"
            />
            <div className="flex justify-end px-1">
              <button
                onClick={handleBuild}
                className="flex h-10 items-center gap-1.5 rounded-full bg-white px-5 text-[14px] font-semibold text-neutral-900 transition-transform duration-200 hover:scale-[1.04] active:scale-95"
              >
                Build
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
