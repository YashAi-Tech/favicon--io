import React from "react";

// favicon.io brand mark: black rounded square with a white "f".
const Logo = ({ light = false, size = 26, showText = true }) => {
  const box = size;
  return (
    <span className="flex items-center gap-2 select-none">
      <svg width={box} height={box} viewBox="0 0 100 100" className="shrink-0">
        <rect width="100" height="100" rx="22" fill={light ? "#ffffff" : "#000000"} />
        <text
          x="50" y="50" textAnchor="middle" dominantBaseline="central"
          fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="62"
          fill={light ? "#000000" : "#ffffff"}
        >
          f
        </text>
      </svg>
      {showText && (
        <span className={`text-[20px] font-bold track-h3 ${light ? "text-white" : "text-black"}`}>
          favicon<span className="text-[#0075de]">.io</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
