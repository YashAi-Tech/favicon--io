import React from "react";
import { customerStories } from "../mock/mock";

const StoryCard = ({ story, featured }) => (
  <div
    className={`group flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.18)] ${
      featured ? "lg:col-span-2 lg:row-span-2" : ""
    }`}
  >
    <div>
      <p className="text-[15px] font-bold uppercase tracking-wide text-neutral-900">{story.company}</p>
      <p className={`mt-3 leading-relaxed text-neutral-600 ${featured ? "text-[19px]" : "text-[15px]"}`}>
        {story.desc}
      </p>

      {story.quote && (
        <blockquote className="mt-6 border-l-2 border-rose-400 pl-4 text-[17px] font-medium italic text-neutral-800">
          "{story.quote}"
        </blockquote>
      )}
    </div>

    <div className="mt-6">
      <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-5">
        {story.stats.map((s) => (
          <div key={s.label}>
            <p className="lov-gradient-text text-[22px] font-extrabold leading-none">{s.value}</p>
            <p className="mt-1.5 text-[12px] leading-snug text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      {story.author && (
        <div className="mt-5 flex items-center gap-3">
          <img src={story.avatar} alt={story.author} className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="text-[14px] font-semibold text-neutral-900">{story.author}</p>
            <p className="text-[13px] text-neutral-500">{story.role}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const CustomerStories = () => {
  return (
    <section id="learn" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[42px]">
          The proof is in production
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-neutral-500">
          These companies built the software they needed with Lovable. Now they run their businesses on it.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <StoryCard story={customerStories[1]} featured />
        <StoryCard story={customerStories[0]} />
        <StoryCard story={customerStories[2]} />
        <StoryCard story={customerStories[3]} />
      </div>

      <div className="mt-10 text-center">
        <a
          href="#customers"
          className="inline-flex items-center rounded-full border border-neutral-300 px-6 py-3 text-[15px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          See all customer stories
        </a>
      </div>
    </section>
  );
};

export default CustomerStories;
