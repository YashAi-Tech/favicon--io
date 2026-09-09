import React from "react";
import { Heart, Twitter, Github, Linkedin, Youtube } from "lucide-react";
import { footerColumns } from "../mock/mock";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 fill-[url(#lovgradf)] text-transparent" strokeWidth={0} />
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="lovgradf" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ff7a2f" />
                    <stop offset="50%" stopColor="#ff5b8a" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-[18px] font-semibold text-neutral-900">Lovable</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-neutral-500">
              The AI app builder. Create apps and websites by chatting with AI.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#social"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold uppercase tracking-wide text-neutral-900">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#footer" className="text-[14px] text-neutral-500 transition-colors hover:text-neutral-900">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
          <p className="text-[13px] text-neutral-400">© {new Date().getFullYear()} Lovable Labs Incorporated. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="text-[13px] text-neutral-400 hover:text-neutral-700">Privacy Policy</a>
            <a href="#terms" className="text-[13px] text-neutral-400 hover:text-neutral-700">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
