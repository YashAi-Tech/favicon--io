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
    <section id="download" className="bg-[#f6f5f4] py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
        <h2 className="track-h1 text-4xl font-bold text-black sm:text-5xl">
          Ready to bring your idea to life?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[17px] text-[#615d59]">
          Start building for free. No credit card required.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-2xl border border-[#e6e6e6] bg-white p-2.5 shadow-soft">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuild()}
              placeholder="Ask favicon.io to create a blog about..."
              className="w-full bg-transparent px-3 py-3 text-[16px] text-black placeholder-[#a39e98] outline-none"
            />
            <div className="flex justify-end px-1">
              <button
                onClick={handleBuild}
                className="flex h-10 items-center gap-1.5 rounded-full bg-[#0075de] px-5 text-[16px] font-medium text-white transition-all duration-150 hover:bg-[#005bab] active:scale-90"
              >
                Build <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
