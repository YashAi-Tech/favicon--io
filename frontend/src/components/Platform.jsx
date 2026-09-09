import React from "react";
import {
  BarChart3, Cloud, Plug, ShieldCheck, Bot, CreditCard, Search, Server, Layers, Globe2, Lock, Monitor,
} from "lucide-react";
import { platformFeatures, capabilities } from "../mock/mock";

const capIcons = {
  Analytics: BarChart3,
  Cloud: Cloud,
  Connectors: Plug,
  Security: ShieldCheck,
  "Agent integrations": Bot,
  Payments: CreditCard,
  "SEO & AI search": Search,
};

const featIcons = [Server, Layers, CreditCard, Lock, Monitor];

const Platform = () => {
  return (
    <section id="enterprise" className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[14px] font-semibold uppercase tracking-wider text-rose-500">
            One platform. Endless possibilities.
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[42px]">
            Depend on Lovable, from end to end
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-neutral-500">
            Lovable handles your end-to-end infrastructure — from hosting and authentication to payments and integrations.
          </p>
        </div>

        {/* capability chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {capabilities.map((c) => {
            const Icon = capIcons[c] || Globe2;
            return (
              <span
                key={c}
                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[14px] font-medium text-neutral-700 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Icon className="h-4 w-4 text-neutral-500" />
                {c}
              </span>
            );
          })}
        </div>

        {/* feature cards */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((f, i) => {
            const Icon = featIcons[i % featIcons.length];
            const big = i === 0;
            return (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.18)] ${
                  big ? "lg:col-span-2" : ""
                }`}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[19px] font-semibold text-neutral-900">{f.title}</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-neutral-500">{f.desc}</p>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Platform;
