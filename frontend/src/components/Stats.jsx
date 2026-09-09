import React from "react";
import { globalStats } from "../mock/mock";

const Stats = () => {
  return (
    <section className="border-y border-[#e6e6e6] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <h2 className="track-h1 text-3xl font-bold text-black sm:text-[40px]">Millions count on favicon.io</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[#615d59]">
          People across the world use favicon.io every day to solve problems and seize opportunities. Join them now and turn 'someday' into today.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {globalStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <p className="track-display2 text-4xl font-bold text-black lg:text-5xl">{s.value}</p>
              <p className="mt-3 max-w-[220px] text-[15px] leading-snug text-[#615d59]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
