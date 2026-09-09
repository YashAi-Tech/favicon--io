import React from "react";

// Notion-style "N" mark: black rounded square with a white N.
const Logo = ({ light = false, size = 26, showText = true }) => {
  const box = size;
  return (
    <span className="flex items-center gap-2 select-none">
      <svg width={box} height={box} viewBox="0 0 100 100" className="shrink-0">
        <rect width="100" height="100" rx="22" fill={light ? "#ffffff" : "#000000"} />
        <path
          d="M34 28 h9 l16 24 v-24 h8 v44 h-9 l-16 -24 v24 h-8 z"
          fill={light ? "#000000" : "#ffffff"}
        />
      </svg>
      {showText && (
        <span
          className={`text-[20px] font-bold track-h3 ${light ? "text-white" : "text-black"}`}
        >
          Notion
        </span>
      )}
    </span>
  );
};

export default Logo;
