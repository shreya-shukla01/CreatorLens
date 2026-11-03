import React from 'react';
import { X, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SurfaceMode, TitleTake } from '../types';
import { calculateTruncation } from '../lib/contrast';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalTitle: string;
  selectedTake: TitleTake;
  surface: SurfaceMode;
  thumbnailText: string;
  thumbnailBg: string;
  thumbnailTextColor: string;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  originalTitle,
  selectedTake,
  surface,
  thumbnailText,
  thumbnailBg,
  thumbnailTextColor,
}) => {
  if (!isOpen) return null;

  const origTrunc = calculateTruncation(originalTitle, surface);
  const takeTrunc = calculateTruncation(selectedTake.text, surface);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-4xl bg-surface rounded-2xl border border-theme shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-theme">
          <div>
            <h3
              id="compare-modal-title"
              className="font-heading font-bold text-lg text-ink"
            >
              Side-by-side comparison
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Testing how your original title compares to the selected AI take on {surface} view.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-ink rounded-lg border border-theme bg-canvas focus-ring"
            aria-label="Close comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-canvas/30">
          {/* Left: Original Title Card */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface border border-theme card-shadow">
            <div className="flex items-center justify-between">
              <span className="font-heading font-semibold text-xs text-muted uppercase tracking-wider">
                Original input
              </span>
              <span className="text-xs font-mono tabular-nums text-muted">
                {originalTitle.length} chars
              </span>
            </div>

            {/* Thumbnail Mockup */}
            <div
              className="w-full aspect-video rounded-xl flex items-center justify-center p-3 select-none"
              style={{
                backgroundColor: thumbnailBg,
                color: thumbnailTextColor,
              }}
            >
              <span className="font-heading font-extrabold text-xl uppercase tracking-tight text-center">
                {thumbnailText || 'ADD THUMBNAIL'}
              </span>
            </div>

            {/* Title & Truncation Marker */}
            <div className="flex flex-col gap-1.5 pt-1">
              <h4 className="font-heading font-semibold text-sm text-ink leading-snug">
                {origTrunc.fits ? (
                  originalTitle
                ) : (
                  <>
                    <span>{origTrunc.visibleChars}</span>
                    <span className="text-accent font-bold">...</span>
                  </>
                )}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span>Aanya Vlogs</span>
                <span aria-hidden="true">·</span>
                <span>1.4K views</span>
              </div>
            </div>

            {/* Truncation Status Badge */}
            <div
              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 mt-auto ${
                origTrunc.fits
                  ? 'bg-canvas border-theme text-muted'
                  : 'bg-canvas border-accent/40 text-ink'
              }`}
            >
              {origTrunc.fits ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-accent shrink-0" />
              )}
              <span>{origTrunc.note}</span>
            </div>
          </div>

          {/* Right: Selected Take Card */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface border-2 border-accent card-shadow relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xs text-accent uppercase tracking-wider">
                  Take {selectedTake.id} (Selected)
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums text-success font-semibold">
                {selectedTake.text.length} chars · Good
              </span>
            </div>

            {/* Thumbnail Mockup */}
            <div
              className="w-full aspect-video rounded-xl flex items-center justify-center p-3 select-none"
              style={{
                backgroundColor: thumbnailBg,
                color: thumbnailTextColor,
              }}
            >
              <span className="font-heading font-extrabold text-xl uppercase tracking-tight text-center">
                {thumbnailText || 'ADD THUMBNAIL'}
              </span>
            </div>

            {/* Title & Truncation Marker */}
            <div className="flex flex-col gap-1.5 pt-1">
              <h4 className="font-heading font-semibold text-sm text-ink leading-snug">
                {takeTrunc.fits ? (
                  selectedTake.text
                ) : (
                  <>
                    <span>{takeTrunc.visibleChars}</span>
                    <span className="text-accent font-bold">...</span>
                  </>
                )}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span>Aanya Vlogs</span>
                <span aria-hidden="true">·</span>
                <span>1.4K views</span>
              </div>
            </div>

            {/* Truncation Status Badge */}
            <div
              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 mt-auto ${
                takeTrunc.fits
                  ? 'bg-canvas border-theme text-muted'
                  : 'bg-canvas border-accent/40 text-ink'
              }`}
            >
              {takeTrunc.fits ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-accent shrink-0" />
              )}
              <span>{takeTrunc.note}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme flex justify-end bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-accent text-white hover:opacity-95 transition-opacity focus-ring"
          >
            Done comparing
          </button>
        </div>
      </div>
    </div>
  );
};
