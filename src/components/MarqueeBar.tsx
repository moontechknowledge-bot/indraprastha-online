import React from 'react';
import { MARQUEE_TEXTS } from '../config/systemConfig';
import { motion } from 'motion/react';
import { Flag } from 'lucide-react';

export const MarqueeBar: React.FC = React.memo(() => {
  return (
    <div className="relative overflow-hidden h-10 flex items-center bg-[#FF6A00] border-y border-orange-700/30 shadow-sm">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite;
            will-change: transform;
            backface-visibility: hidden;
            perspective: 1000px;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="flex whitespace-nowrap items-center gap-12 px-4 animate-marquee">
        {/* Duplicate the list to ensure seamless looping */}
        {[...MARQUEE_TEXTS, ...MARQUEE_TEXTS].map((text, index) => (
          <span 
            key={index} 
            className="text-[14px] font-bold text-black flex items-center gap-4"
          >
            {text}
            <span className="flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full border border-black/10">
              <span className="text-red-600 text-lg">🚩</span>
              <span className="text-red-700 font-black">जय श्री राम</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
});
