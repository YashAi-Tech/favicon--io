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
        scrolled ? "bg-[#faf8f5]/85 backdrop-blur-xl border-b border-[#ece6df]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3 lg:px-8">
        <div className="flex items-center gap-9">
          <button onClick={() => navigate("/")} aria-label="Home">
            <Logo />
          </button>
          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="flex items-center gap-0.5 text-[15px] font-medium text-[#4a463f] transition-colors hover:text-[#1b1a18]"
                >
                  {l.label}
                  {(l.label === "Product" || l.label === "Solutions") && (
                    <ChevronDown className="h-3.5 w-3.5 text-[#a39e98]" />
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
              className="rounded-full bg-[#f9540b] px-4 py-2 text-[15px] font-semibold text-white shadow-glow transition-all duration-150 hover:bg-[#d9430a] active:scale-95"
            >
              Go to workspace
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-[15px] font-medium text-[#4a463f] transition-colors hover:text-[#1b1a18]"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-full bg-[#f9540b] px-4 py-2 text-[15px] font-semibold text-white shadow-glow transition-all duration-150 hover:bg-[#d9430a] active:scale-95"
              >
                Start building
              </button>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#1b1a18] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[#ece6df] bg-[#faf8f5] px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-[#4a463f] hover:bg-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            {user ? (
              <button onClick={() => { setOpen(false); navigate("/dashboard"); }} className="rounded-full bg-[#f9540b] px-4 py-2.5 text-center text-[15px] font-semibold text-white">
                Go to workspace
              </button>
            ) : (
              <>
                <button onClick={() => { setOpen(false); navigate("/login"); }} className="rounded-full border border-[#ece6df] bg-white px-4 py-2.5 text-center text-[15px] font-medium text-[#1b1a18]">
                  Log in
                </button>
                <button onClick={() => { setOpen(false); navigate("/signup"); }} className="rounded-full bg-[#f9540b] px-4 py-2.5 text-center text-[15px] font-semibold text-white">
                  Start building
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
