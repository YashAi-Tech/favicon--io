import React, { useState } from "react";
import { Heart } from "lucide-react";
import { showcaseTabs, showcaseProjects } from "../mock/mock";

const Showcase = () => {
  const [active, setActive] = useState(showcaseTabs[0]);
  const [liked, setLiked] = useState({});
  const toggleLike = (id) => setLiked((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section id="community" className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className="track-h1 text-3xl font-bold text-black sm:text-[40px]">From the community</h2>
          <p className="mt-2 text-[16px] text-[#615d59]">Explore what the community is building with favicon.io.</p>
        </div>
        <a href="#community" className="text-[15px] font-medium text-[#0075de] underline-offset-4 hover:underline">
          View all
        </a>
      </div>

      <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        {showcaseTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
              active === tab ? "bg-black text-white" : "border border-[#e6e6e6] bg-white text-[#31302e] hover:bg-[#f6f5f4]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {showcaseProjects.map((p) => (
          <div
            key={p.id}
            className="group overflow-hidden rounded-xl border border-[#e6e6e6] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#f6f5f4]">
              <img src={p.image} alt={p.title} loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold uppercase text-white" style={{ background: p.color }}>
                  {p.author[0]}
                </span>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold text-black">{p.title}</p>
                  <p className="text-[12px] text-[#a39e98]">@{p.author}</p>
                </div>
              </div>
              <button
                onClick={() => toggleLike(p.id)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-[#615d59] transition-colors hover:bg-[#f6f5f4]"
              >
                <Heart className={`h-4 w-4 transition-colors ${liked[p.id] ? "fill-[#ff64c8] text-[#ff64c8]" : ""}`} />
                {p.remixes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Showcase;
