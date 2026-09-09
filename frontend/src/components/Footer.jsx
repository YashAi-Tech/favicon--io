import React from "react";
import { Twitter, Github, Linkedin, Youtube } from "lucide-react";
import { footerColumns } from "../mock/mock";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="border-t border-[#e6e6e6] bg-[#f6f5f4]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[#615d59]">
              The AI workspace that works for you. Build apps and websites by chatting with AI.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#social"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e6e6e6] bg-white text-[#615d59] transition-colors hover:text-black">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold uppercase tracking-[0.125px] text-black">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#footer" className="text-[14px] text-[#31302e] transition-colors hover:text-black">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#e6e6e6] pt-8 sm:flex-row">
          <p className="text-[13px] text-[#a39e98]">© {new Date().getFullYear()} favicon.io Labs, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="text-[13px] text-[#a39e98] hover:text-black">Privacy Policy</a>
            <a href="#terms" className="text-[13px] text-[#a39e98] hover:text-black">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
