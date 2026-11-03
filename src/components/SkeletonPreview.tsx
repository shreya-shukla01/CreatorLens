import React, { useState, useEffect } from 'react';
import { ROTATING_LOADING_MESSAGES } from '../lib/constants';

export const SkeletonPreview: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_LOADING_MESSAGES.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Generating AI optimization"
      className="flex flex-col gap-6 w-full animate-pulse"
    >
      {/* Rotating Status Banner */}
      <div className="p-4 rounded-2xl bg-surface border border-theme card-shadow flex items-center justify-center gap-3">
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="font-heading font-semibold text-sm text-ink transition-all duration-300">
          {ROTATING_LOADING_MESSAGES[messageIndex]}
        </span>
      </div>

      {/* Preview Card Skeleton */}
      <div className="bg-surface rounded-2xl p-5 border border-theme card-shadow flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-theme">
          <div className="h-5 w-32 bg-canvas rounded-lg" />
          <div className="h-7 w-28 bg-canvas rounded-lg" />
        </div>

        <div className="w-full flex items-center justify-center p-6 bg-canvas/60 rounded-xl">
          <div className="w-full max-w-[340px] bg-surface rounded-2xl p-3 border border-theme flex flex-col gap-3">
            <div className="w-full aspect-video bg-canvas rounded-xl" />
            <div className="flex gap-3 pt-1">
              <div className="w-9 h-9 rounded-full bg-canvas shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-5/6 bg-canvas rounded" />
                <div className="h-3 w-1/2 bg-canvas rounded" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-10 w-full bg-canvas rounded-xl" />
      </div>

      {/* Takes & Chapters Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-theme h-36" />
        <div className="p-4 rounded-2xl bg-surface border border-theme h-36" />
      </div>
    </div>
  );
};
