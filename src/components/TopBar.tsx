import React from 'react';
import { Smartphone, Monitor, Tv, Moon, Sun, History, Sparkles } from 'lucide-react';
import { SurfaceMode } from '../types';

interface TopBarProps {
  surface: SurfaceMode;
  onSurfaceChange: (surface: SurfaceMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  surface,
  onSurfaceChange,
  isDark,
  onToggleTheme,
  historyCount,
  onOpenHistory,
}) => {
  const surfaces: Array<{ id: SurfaceMode; label: string; icon: React.ReactNode }> = [
    { id: 'phone', label: 'Phone', icon: <Smartphone className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'desktop', label: 'Desktop', icon: <Monitor className="w-3.5 h-3.5" aria-hidden="true" /> },
    { id: 'tv', label: 'TV', icon: <Tv className="w-3.5 h-3.5" aria-hidden="true" /> },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % surfaces.length;
      onSurfaceChange(surfaces[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + surfaces.length) % surfaces.length;
      onSurfaceChange(surfaces[prevIndex].id);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-theme bg-surface/95 backdrop-blur-sm transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center relative shrink-0"
            aria-hidden="true"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg tracking-tight text-ink leading-none">
              CreatorLens
            </span>
            <span className="text-[11px] text-muted tracking-tight hidden sm:inline">
              See it before your viewers do
            </span>
          </div>
        </div>

        {/* Center: Surface Segmented Control */}
        <div
          role="tablist"
          aria-label="Preview surface view"
          className="flex items-center p-1 bg-canvas rounded-xl border border-theme"
        >
          {surfaces.map((item, index) => {
            const isActive = surface === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isActive}
                aria-controls="live-preview-surface"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSurfaceChange(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap focus-ring ${
                  isActive
                    ? 'bg-surface text-ink card-shadow font-semibold'
                    : 'text-muted hover:text-ink hover:bg-surface/50'
                }`}
              >
                <span className={isActive ? 'text-accent' : 'text-muted'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions (History & Theme Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenHistory}
            aria-label={`View recent videos (${historyCount})`}
            title="Recent videos"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-theme bg-surface hover:bg-canvas text-ink transition-colors duration-150 focus-ring min-h-[40px]"
          >
            <History className="w-4 h-4 text-muted" aria-hidden="true" />
            <span className="hidden md:inline">Recent</span>
            {historyCount > 0 && (
              <span className="text-[11px] font-mono text-muted tabular-nums">
                ({historyCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl border border-theme bg-surface hover:bg-canvas text-muted hover:text-ink transition-colors duration-150 focus-ring min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-warning" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
