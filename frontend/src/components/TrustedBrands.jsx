import React from "react";
import { brands } from "../mock/mock";

const TrustedBrands = () => {
  return (
    <section className="border-y border-neutral-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-center text-[14px] font-medium text-neutral-500">
          Trusted by top brands and teams building the software that runs their business
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {brands.map((b) => (
            <span
              key={b}
              className="text-[22px] font-bold tracking-tight text-neutral-300 grayscale transition-all duration-300 hover:text-neutral-800 hover:grayscale-0 lg:text-[26px]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;
