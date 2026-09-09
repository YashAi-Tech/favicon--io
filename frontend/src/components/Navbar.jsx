import React, { useState, useEffect } from "react";
import { Heart, Menu, X } from "lucide-react";
import { navLinks } from "../mock/mock";

const Logo = () => (
  <a href="#top" className="flex items-center gap-2 select-none">
    <span className="relative flex h-7 w-7 items-center justify-center">
      <Heart className="h-7 w-7 fill-[url(#lovgrad)] text-transparent" strokeWidth={0} />
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="lovgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff7a2f" />
            <stop offset="50%" stopColor="#ff5b8a" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </span>
    <span className="text-[19px] font-semibold tracking-tight text-neutral-900">Lovable</span>
  </a>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-neutral-200/70" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo />
          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-[14px] font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#login"
            className="text-[14px] font-medium text-neutral-700 transition-colors hover:text-neutral-900"
          >
            Log in
          </a>
          <a
            href="#signup"
            className="rounded-full bg-neutral-900 px-4 py-2 text-[14px] font-medium text-white transition-transform duration-200 hover:scale-[1.03] hover:bg-neutral-800"
          >
            Get started
          </a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-800 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            <a href="#login" className="rounded-full border border-neutral-300 px-4 py-2.5 text-center text-[15px] font-medium text-neutral-800">
              Log in
            </a>
            <a href="#signup" className="rounded-full bg-neutral-900 px-4 py-2.5 text-center text-[15px] font-medium text-white">
              Get started
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
