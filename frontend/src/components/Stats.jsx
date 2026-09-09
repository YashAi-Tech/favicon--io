import React from "react";
import { globalStats } from "../mock/mock";

const Stats = () => {
  return (
    <section className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[42px]">
          Millions count on Lovable
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-neutral-500">
          People across the world use Lovable every day to solve problems and seize opportunities. Join them now and turn 'someday' into today.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {globalStats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <p className="lov-gradient-text text-4xl font-extrabold tracking-tight lg:text-5xl">
                {s.value}
              </p>
              <p className="mt-3 max-w-[220px] text-[15px] leading-snug text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
