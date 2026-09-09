import React, { useState } from "react";
import { Heart, GitFork } from "lucide-react";
import { showcaseTabs, showcaseProjects } from "../mock/mock";

const Showcase = () => {
  const [active, setActive] = useState(showcaseTabs[0]);
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => setLiked((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section id="community" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            From the Community
          </h2>
          <p className="mt-2 text-[16px] text-neutral-500">
            Explore what the community is building with Lovable.
          </p>
        </div>
        <a href="#community" className="text-[14px] font-semibold text-neutral-900 underline-offset-4 hover:underline">
          View all
        </a>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0">
        {showcaseTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
              active === tab
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {showcaseProjects.map((p) => (
          <div
            key={p.id}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.25)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-purple-400 text-[12px] font-semibold uppercase text-white">
                  {p.author[0]}
                </span>
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold text-neutral-900">{p.title}</p>
                  <p className="text-[12px] text-neutral-400">@{p.author}</p>
                </div>
              </div>
              <button
                onClick={() => toggleLike(p.id)}
                className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${liked[p.id] ? "fill-rose-500 text-rose-500" : ""}`}
                />
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
