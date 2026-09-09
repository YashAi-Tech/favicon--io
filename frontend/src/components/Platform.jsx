import React from "react";
import {
  BarChart3, Cloud, Plug, ShieldCheck, Bot, CreditCard, Search, Server, Layers, Globe2, Lock, Monitor,
} from "lucide-react";
import { platformFeatures, capabilities } from "../mock/mock";

const capIcons = {
  Analytics: BarChart3, Cloud: Cloud, Connectors: Plug, Security: ShieldCheck,
  "Agent integrations": Bot, Payments: CreditCard, "SEO & AI search": Search,
};
const featIcons = [Server, Layers, CreditCard, Lock, Monitor];

const Platform = () => {
  return (
    <section id="product" className="border-y border-[#e6e6e6] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.125px] text-[#0075de] shadow-soft">
            One platform. Endless possibilities.
          </span>
          <h2 className="track-h1 mt-4 text-3xl font-bold text-black sm:text-[40px]">
            Depend on Notion, from end to end
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#615d59]">
            Notion handles your end-to-end infrastructure — from hosting and authentication to payments and integrations.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {capabilities.map((c) => {
            const Icon = capIcons[c] || Globe2;
            return (
              <span key={c}
                className="flex items-center gap-2 rounded-md border border-[#e6e6e6] bg-white px-4 py-2 text-[14px] font-medium text-[#31302e] transition-transform hover:-translate-y-0.5">
                <Icon className="h-4 w-4 text-[#615d59]" />
                {c}
              </span>
            );
          })}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((f, i) => {
            const Icon = featIcons[i % featIcons.length];
            const big = i === 0;
            return (
              <div key={f.title}
                className={`group relative overflow-hidden rounded-xl border border-[#e6e6e6] bg-white p-7 transition-all duration-300 hover:shadow-soft ${big ? "lg:col-span-2" : ""}`}>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg text-white" style={{ background: f.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="track-h3 text-[22px] font-bold text-black">{f.title}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#615d59]">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Platform;
