import React from "react";
import { brands } from "../mock/mock";

const TrustedBrands = () => {
  return (
    <section className="bg-[#faf8f5] py-14">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <p className="text-center text-[14px] font-medium text-[#615d59]">
          Trusted by top brands and teams building the software that runs their business
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {brands.map((b) => (
            <span key={b}
              className="text-[22px] font-bold text-[#a39e98] transition-colors duration-300 hover:text-black lg:text-[26px]">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;
