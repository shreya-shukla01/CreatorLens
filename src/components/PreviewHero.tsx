import React, { useState } from 'react';
import {
  Check,
  AlertTriangle,
  Sparkles,
  Columns,
  Eye,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { SurfaceMode, TitleTake, ThumbnailIdea } from '../types';
import { COLOR_SWATCHES } from '../lib/constants';
import { calculateTruncation } from '../lib/contrast';

interface PreviewHeroProps {
  surface: SurfaceMode;
  displayTitle: string;
  originalTitle: string;
  isShowingOriginal: boolean;
  onToggleBeforeAfter: () => void;
  onOpenCompare: () => void;
  thumbnailText: string;
  onThumbnailTextChange: (text: string) => void;
  thumbnailBg: string;
  onThumbnailBgChange: (color: string) => void;
  thumbnailTextColor: string;
  thumbnailBlurPx: number;
  thumbnailIdeas: ThumbnailIdea[];
  descriptionSnippet: string;
  activeTake?: TitleTake;
}

export const PreviewHero: React.FC<PreviewHeroProps> = ({
  surface,
  displayTitle,
  originalTitle,
  isShowingOriginal,
  onToggleBeforeAfter,
  onOpenCompare,
  thumbnailText,
  onThumbnailTextChange,
  thumbnailBg,
  onThumbnailBgChange,
  thumbnailTextColor,
  thumbnailBlurPx,
  thumbnailIdeas,
  descriptionSnippet,
  activeTake,
}) => {
  const [isEditingThumbText, setIsEditingThumbText] = useState(false);
  const [tempThumbText, setTempThumbText] = useState(thumbnailText);

  // Compute live truncation metrics for current surface
  const truncation = calculateTruncation(displayTitle, surface);

  const handleSaveThumbText = () => {
    setIsEditingThumbText(false);
    onThumbnailTextChange(tempThumbText);
  };

  const channelName = 'Aanya Vlogs';
  const statsLine = '1.4K views · 3 hours ago';

  return (
    <section
      id="live-preview-surface"
      aria-label="Live multi-surface feed card preview"
      className="bg-surface rounded-2xl p-5 border border-theme card-shadow flex flex-col gap-5 transition-colors duration-200"
    >
      {/* Top Controls: Surface Mode Label, Before/After & Compare */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme pb-4">
        <div className="flex items-center gap-2">
          <span className="font-heading font-semibold text-base text-ink">
            Live feed preview
          </span>
          <span className="text-xs text-muted">
            · {surface === 'phone' ? 'Phone feed' : surface === 'desktop' ? 'Desktop search' : 'TV home tile'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Before/After Toggle */}
          <div className="flex items-center p-0.5 bg-canvas rounded-xl border border-theme">
            <button
              type="button"
              onClick={isShowingOriginal ? undefined : onToggleBeforeAfter}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors focus-ring ${
                isShowingOriginal
                  ? 'bg-surface text-ink font-semibold card-shadow'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={!isShowingOriginal ? undefined : onToggleBeforeAfter}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors focus-ring ${
                !isShowingOriginal
                  ? 'bg-surface text-ink font-semibold card-shadow'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Selected take
            </button>
          </div>

          {/* Compare Button */}
          <button
            type="button"
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-theme bg-surface hover:bg-canvas text-ink transition-colors focus-ring"
            title="Compare original vs selected take side by side"
          >
            <Columns className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* Truncation Inspector Strip */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors duration-150 ${
          truncation.fits
            ? 'bg-canvas border-theme text-muted'
            : 'bg-canvas border-accent/40 text-ink'
        }`}
      >
        <div className="flex items-center gap-2">
          {truncation.fits ? (
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
          )}
          <span className="font-medium">
            {truncation.fits ? 'Fits fully' : `Cut off after ${truncation.limit} characters on this surface`}
          </span>
        </div>
        <div className="text-[11px] font-mono tabular-nums text-muted">
          {displayTitle.length} / {truncation.limit} max visible
        </div>
      </div>

      {/* Surface Card Render Area */}
      <div className="w-full flex items-center justify-center p-4 sm:p-6 bg-canvas/60 rounded-xl border border-theme/60 overflow-hidden min-h-[320px]">
        {/* Surface 1: Phone Feed */}
        {surface === 'phone' && (
          <div className="w-full max-w-[340px] bg-surface rounded-2xl border border-theme card-shadow overflow-hidden transition-all duration-200">
            {/* 16:9 Thumbnail */}
            <div
              className="relative w-full aspect-video flex items-center justify-center p-4 select-none overflow-hidden transition-all duration-150"
              style={{
                backgroundColor: thumbnailBg,
                color: thumbnailTextColor,
                filter: `blur(${thumbnailBlurPx}px)`,
              }}
            >
              <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-center leading-tight uppercase drop-shadow-sm px-2">
                {thumbnailText || 'ADD THUMBNAIL'}
              </span>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white tracking-wide">
                07:24
              </div>
            </div>

            {/* Video Feed Metadata */}
            <div className="p-3.5 flex gap-3">
              <div
                className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 flex items-center justify-center font-bold text-xs text-ink/80"
                aria-hidden="true"
              >
                AV
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3
                  className="font-heading font-semibold text-sm text-ink leading-snug break-words"
                  title={displayTitle}
                >
                  {truncation.fits ? (
                    displayTitle
                  ) : (
                    <>
                      <span>{truncation.visibleChars}</span>
                      <span className="text-accent font-bold" title="Truncated text">
                        ...
                      </span>
                    </>
                  )}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted mt-1">
                  <span>{channelName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{statsLine}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Surface 2: Desktop Search Result */}
        {surface === 'desktop' && (
          <div className="w-full max-w-[680px] bg-surface rounded-2xl border border-theme card-shadow p-3.5 flex flex-col sm:flex-row gap-4 transition-all duration-200">
            {/* Left: 16:9 Thumbnail */}
            <div className="w-full sm:w-[240px] shrink-0">
              <div
                className="relative w-full aspect-video rounded-xl flex items-center justify-center p-3 select-none overflow-hidden"
                style={{
                  backgroundColor: thumbnailBg,
                  color: thumbnailTextColor,
                  filter: `blur(${thumbnailBlurPx}px)`,
                }}
              >
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-center leading-tight uppercase drop-shadow-sm px-1">
                  {thumbnailText || 'ADD THUMBNAIL'}
                </span>
                <div className="absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                  07:24
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h3
                className="font-heading font-semibold text-base text-ink leading-snug break-words"
                title={displayTitle}
              >
                {truncation.fits ? (
                  displayTitle
                ) : (
                  <>
                    <span>{truncation.visibleChars}</span>
                    <span className="text-accent font-bold">...</span>
                  </>
                )}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted mt-1.5">
                <span className="font-medium text-ink">{channelName}</span>
                <span aria-hidden="true">·</span>
                <span>{statsLine}</span>
              </div>
              <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                {descriptionSnippet || 'A realistic look into my morning routine during midterm week...'}
              </p>
            </div>
          </div>
        )}

        {/* Surface 3: TV Home Card */}
        {surface === 'tv' && (
          <div className="w-full max-w-[540px] bg-surface rounded-2xl border border-theme card-shadow overflow-hidden transition-all duration-200">
            {/* Large 16:9 Thumbnail */}
            <div
              className="relative w-full aspect-video flex items-center justify-center p-6 select-none overflow-hidden"
              style={{
                backgroundColor: thumbnailBg,
                color: thumbnailTextColor,
                filter: `blur(${thumbnailBlurPx}px)`,
              }}
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-center leading-tight uppercase drop-shadow-md px-3">
                {thumbnailText || 'ADD THUMBNAIL'}
              </span>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-xs font-mono text-white">
                07:24
              </div>
            </div>

            {/* 1 Line TV Title */}
            <div className="p-4 flex flex-col gap-1">
              <h3
                className="font-heading font-bold text-base text-ink truncate"
                title={displayTitle}
              >
                {truncation.fits ? (
                  displayTitle
                ) : (
                  <>
                    <span>{truncation.visibleChars}</span>
                    <span className="text-accent font-bold">...</span>
                  </>
                )}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>{channelName}</span>
                <span aria-hidden="true">·</span>
                <span>{statsLine}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Controls & AI Suggestions */}
      <div className="flex flex-col gap-3 pt-2 border-t border-theme">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-ink">Thumbnail text:</span>
            {isEditingThumbText ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempThumbText}
                  onChange={(e) => setTempThumbText(e.target.value)}
                  maxLength={30}
                  className="px-2.5 py-1 text-xs bg-canvas border border-theme rounded-lg text-ink focus-ring font-bold uppercase w-48"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveThumbText();
                    if (e.key === 'Escape') setIsEditingThumbText(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveThumbText}
                  className="p-1.5 rounded-lg bg-surface border border-theme hover:bg-canvas text-ink text-xs focus-ring"
                  title="Save thumbnail text"
                >
                  <Check className="w-3.5 h-3.5 text-success" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempThumbText(thumbnailText);
                  setIsEditingThumbText(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase bg-canvas border border-theme rounded-lg text-ink hover:border-muted transition-colors focus-ring"
              >
                <span>{thumbnailText || 'Edit text'}</span>
                <Edit2 className="w-3 h-3 text-muted" aria-hidden="true" />
              </button>
            )}
            <span className="text-[11px] text-muted">(max 4 words)</span>
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted mr-1">Swatch:</span>
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = thumbnailBg === swatch.hex;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => onThumbnailBgChange(swatch.hex)}
                  title={swatch.name}
                  aria-label={`Select ${swatch.name}`}
                  className={`w-6 h-6 rounded-full border-2 transition-transform focus-ring ${
                    isSelected
                      ? 'scale-110 border-accent'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* AI Thumbnail Text Ideas */}
        {thumbnailIdeas.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-accent" aria-hidden="true" />
              <span>AI ideas:</span>
            </span>
            {thumbnailIdeas.map((idea) => (
              <button
                key={idea.id}
                type="button"
                onClick={() => onThumbnailTextChange(idea.text)}
                title={idea.idea}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-theme bg-canvas hover:bg-surface text-ink transition-colors focus-ring"
              >
                &ldquo;{idea.text}&rdquo;
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
