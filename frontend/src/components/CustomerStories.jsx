import React from "react";
import { customerStories } from "../mock/mock";

const StoryCard = ({ story, featured }) => (
  <div
    className={`flex flex-col justify-between rounded-xl border border-[#e6e6e6] bg-white p-7 transition-all duration-300 hover:shadow-soft ${
      featured ? "lg:col-span-2 lg:row-span-2" : ""
    }`}
  >
    <div>
      <p className="text-[14px] font-bold uppercase tracking-[0.125px] text-black">{story.company}</p>
      <p className={`mt-3 leading-relaxed text-[#31302e] ${featured ? "text-[20px] track-title" : "text-[15px]"}`}>
        {story.desc}
      </p>
      {story.quote && (
        <blockquote className="mt-6 border-l-2 border-[#0075de] pl-4 text-[17px] font-medium text-black">
          “{story.quote}”
        </blockquote>
      )}
    </div>

    <div className="mt-6">
      <div className="grid grid-cols-3 gap-4 border-t border-[#e6e6e6] pt-5">
        {story.stats.map((s) => (
          <div key={s.label}>
            <p className="track-h3 text-[22px] font-bold leading-none text-black">{s.value}</p>
            <p className="mt-1.5 text-[12px] leading-snug text-[#615d59]">{s.label}</p>
          </div>
        ))}
      </div>
      {story.author && (
        <div className="mt-5 flex items-center gap-3">
          <img src={story.avatar} alt={story.author} className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="text-[14px] font-semibold text-black">{story.author}</p>
            <p className="text-[13px] text-[#615d59]">{story.role}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

const CustomerStories = () => {
  return (
    <section id="solutions" className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="track-h1 text-3xl font-bold text-black sm:text-[40px]">The proof is in production</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-[#615d59]">
          These companies built the software they needed with favicon.io. Now they run their businesses on it.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <StoryCard story={customerStories[1]} featured />
        <StoryCard story={customerStories[0]} />
        <StoryCard story={customerStories[2]} />
        <StoryCard story={customerStories[3]} />
      </div>

      <div className="mt-10 text-center">
        <a href="#customers"
          className="inline-flex items-center rounded-full border border-[#e6e6e6] bg-white px-6 py-3 text-[15px] font-medium text-black shadow-soft transition-transform hover:scale-[1.02]">
          See all customer stories
        </a>
      </div>
    </section>
  );
};

export default CustomerStories;
