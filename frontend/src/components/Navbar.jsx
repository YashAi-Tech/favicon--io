import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navLinks } from "../mock/mock";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-xl border-b border-[#e6e6e6]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-9">
          <button onClick={() => navigate("/")} aria-label="Home">
            <Logo light={!scrolled} />
          </button>
          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className={`flex items-center gap-0.5 text-[15px] font-medium transition-colors ${
                    scrolled ? "text-[#31302e] hover:text-black" : "text-white/85 hover:text-white"
                  }`}
                >
                  {l.label}
                  {(l.label === "Product" || l.label === "Solutions") && (
                    <ChevronDown className={`h-3.5 w-3.5 ${scrolled ? "text-[#a39e98]" : "text-white/60"}`} />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-md border border-[#e6e6e6] bg-white px-3.5 py-1.5 text-[15px] font-medium text-black shadow-soft transition-transform duration-150 hover:scale-[1.02] active:scale-95"
            >
              Go to workspace
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`text-[15px] font-medium transition-colors ${
                  scrolled ? "text-[#31302e] hover:text-black" : "text-white/85 hover:text-white"
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-md border border-[#e6e6e6] bg-white px-3.5 py-1.5 text-[15px] font-medium text-black shadow-soft transition-transform duration-150 hover:scale-[1.02] active:scale-95"
              >
                Get favicon.io free
              </button>
            </>
          )}
        </div>

        <button
          className={`flex h-9 w-9 items-center justify-center rounded-md lg:hidden ${scrolled ? "text-black" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[#e6e6e6] bg-white px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-[#31302e] hover:bg-[#f6f5f4]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            {user ? (
              <button onClick={() => { setOpen(false); navigate("/dashboard"); }} className="rounded-md border border-[#e6e6e6] bg-white px-4 py-2.5 text-center text-[15px] font-medium text-black">
                Go to workspace
              </button>
            ) : (
              <>
                <button onClick={() => { setOpen(false); navigate("/login"); }} className="rounded-md border border-[#e6e6e6] px-4 py-2.5 text-center text-[15px] font-medium text-black">
                  Log in
                </button>
                <button onClick={() => { setOpen(false); navigate("/signup"); }} className="rounded-full bg-[#0075de] px-4 py-2.5 text-center text-[15px] font-medium text-white">
                  Get favicon.io free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
