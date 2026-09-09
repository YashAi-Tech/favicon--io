import React from "react";

// favicon.io logo — an "app-icon" tile (nodding to what a favicon is)
// with a warm orange gradient and a clean geometric monogram.
const Logo = ({ light = false, size = 28, showText = true }) => {
  const gid = React.useId();
  return (
    <span className="flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff7a1a" />
            <stop offset="100%" stopColor="#f9540b" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="26" fill={`url(#${gid})`} />
        {/* geometric 'f': vertical stem + top hook + crossbar */}
        <path
          d="M62 30 h-9 a11 11 0 0 0 -11 11 v7 h-9 v10 h9 v22 h11 v-22 h11 v-10 h-11 v-5 a3 3 0 0 1 3 -3 h6 z"
          fill="#ffffff"
        />
      </svg>
      {showText && (
        <span className={`text-[19px] font-bold track-h3 ${light ? "text-white" : "text-[#1b1a18]"}`}>
          favicon<span className="text-[#f9540b]">.io</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
