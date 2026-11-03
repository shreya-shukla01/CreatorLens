import React from 'react';
import { Check, Copy, CheckCircle, Columns } from 'lucide-react';
import { TitleTake } from '../types';

interface TakesRailProps {
  takes: TitleTake[];
  selectedTakeIndex: number;
  onSelectTake: (index: number) => void;
  onCopyTake: (text: string) => void;
  onOpenCompare: () => void;
}

export const TakesRail: React.FC<TakesRailProps> = ({
  takes,
  selectedTakeIndex,
  onSelectTake,
  onCopyTake,
  onOpenCompare,
}) => {
  return (
    <aside
      aria-label="AI Title Options (Takes)"
      className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-base text-ink tracking-tight">
            AI title options
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Click a Take to test it in the live preview.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCompare}
          className="flex items-center gap-1 text-xs font-medium text-muted hover:text-ink px-2 py-1 rounded-lg border border-theme bg-surface hover:bg-canvas transition-colors focus-ring"
          title="Compare original with selected take"
        >
          <Columns className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Compare</span>
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label="Title Takes"
        className="flex flex-col gap-3"
      >
        {takes.map((take, index) => {
          const isSelected = selectedTakeIndex === index;
          const isGood = take.text.length <= 60;

          return (
            <div
              key={take.id || index}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectTake(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTake(index);
                }
              }}
              className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col gap-2.5 bg-surface card-shadow focus-ring relative ${
                isSelected
                  ? 'border-accent ring-1 ring-accent'
                  : 'border-theme hover:border-muted/50'
              }`}
            >
              {/* Header: Take Label & Character Count Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xs text-ink">
                    Take {index + 1}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-accent">
                      <Check className="w-3 h-3" aria-hidden="true" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-mono tabular-nums font-semibold ${
                      isGood ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {take.text.length}/60 {isGood ? 'good' : 'long'}
                  </span>
                </div>
              </div>

              {/* Title Text */}
              <p className="text-sm font-semibold text-ink leading-snug break-words">
                {take.text}
              </p>

              {/* Why statement */}
              <p className="text-xs text-muted leading-relaxed">
                {take.why}
              </p>

              {/* Footer Actions: Copy Button */}
              <div className="flex items-center justify-between pt-2 border-t border-theme/60 mt-0.5">
                <span className="text-[11px] text-muted">
                  {isSelected ? 'Applied to preview' : 'Click to preview'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyTake(take.text);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-theme bg-canvas hover:bg-surface text-ink transition-colors focus-ring"
                  aria-label={`Copy Take ${index + 1}`}
                >
                  <Copy className="w-3 h-3 text-muted" aria-hidden="true" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
