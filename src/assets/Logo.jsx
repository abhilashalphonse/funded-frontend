import React from 'react';

const Logo = ({ width = "100%", height = "100%", className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1200 512" 
      width={width} 
      height={height} 
      className={className}
    >
      <defs>
        <linearGradient id="topRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00F2FE" />
          <stop offset="100%" stop-color="#0072FF" />
        </linearGradient>
        <linearGradient id="rightRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0072FF" />
          <stop offset="100%" stop-color="#0033AA" />
        </linearGradient>
        <linearGradient id="bottomRibbon" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0033AA" />
          <stop offset="100%" stop-color="#0055FF" />
        </linearGradient>
        <linearGradient id="leftRibbon" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0055FF" />
          <stop offset="100%" stop-color="#00F2FE" />
        </linearGradient>
      </defs>

      <g id="Brand-Mark">
        {/* 1. Logo Symbol scaled to 0.8 */}
        <g id="Logo-Icon" transform="translate(40, 51) scale(0.8)">
          <path d="M 160 64 L 352 64 C 410 64 448 102 448 160 L 448 240 C 390 190 350 176 280 176 L 176 176 C 176 140 165 100 160 64 Z" fill="url(#topRibbon)" />
          <path d="M 448 160 L 448 352 C 448 410 410 448 352 448 L 272 448 C 322 390 336 350 336 280 L 336 176 C 372 176 412 165 448 160 Z" fill="url(#rightRibbon)" />
          <path d="M 352 448 L 160 448 C 102 448 64 410 64 352 L 64 272 C 122 322 162 336 232 336 L 336 336 C 336 372 347 412 352 448 Z" fill="url(#bottomRibbon)" />
          <path d="M 64 352 L 64 160 C 64 102 102 64 160 64 L 240 64 C 190 122 176 162 176 232 L 176 336 C 140 336 100 347 64 352 Z" fill="url(#leftRibbon)" />
        </g>

        {/* 2. Perfectly Aligned Typography */}
        <text 
          x="460" 
          y="342" 
          fontFamily="'Montserrat', 'Inter', 'Helvetica Neue', Arial, sans-serif" 
          fontSize="215px" 
          fontWeight="500" 
          fill="#FFFFFF"
          letterSpacing="12px"
        >
          ACG
        </text>
      </g>
    </svg>
  );
};

export default Logo;