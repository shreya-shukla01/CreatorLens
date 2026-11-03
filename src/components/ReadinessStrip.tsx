import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  X,
  ShieldCheck,
} from 'lucide-react';
import { ReadinessCheck } from '../types';

interface ReadinessStripProps {
  fixes: ReadinessCheck[];
}

export const ReadinessStrip: React.FC<ReadinessStripProps> = ({ fixes }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const passedCount = fixes.filter((f) => f.status === 'ok').length;
  const totalCount = fixes.length || 6;
  const allPassed = passedCount === totalCount;

  return (
    <>
      {/* Bottom Pinned Bar */}
      <aside
        aria-label="Publish readiness overview"
        className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-theme px-4 py-2.5 transition-all duration-200 card-shadow"
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Summary & Segmented Progress Bar */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls="readiness-checklist-drawer"
            className="flex items-center gap-3.5 text-left focus-ring rounded-xl p-1 -m-1 group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`w-5 h-5 ${allPassed ? 'text-success' : 'text-accent'}`}
                aria-hidden="true"
              />
              <span className="font-heading font-semibold text-xs sm:text-sm text-ink">
                Publish readiness:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-ink font-mono tabular-nums">
                {passedCount} of {totalCount} checks passed
              </span>
            </div>

            {/* Segmented Progress Bar: 6 distinct blocks */}
            <div
              className="flex items-center gap-1 w-24 sm:w-36 h-2 rounded-full overflow-hidden p-0.5 bg-canvas border border-theme"
              aria-hidden="true"
            >
              {fixes.map((check, idx) => {
                const isPassed = check.status === 'ok';
                return (
                  <div
                    key={check.id || idx}
                    className={`h-full flex-1 rounded-sm transition-colors duration-200 ${
                      isPassed ? 'bg-success' : 'bg-canvas border border-accent/40'
                    }`}
                  />
                );
              })}
            </div>
          </button>

          {/* Right: Expand/Collapse Trigger */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-theme bg-canvas hover:bg-surface text-ink transition-colors focus-ring"
            aria-label={isExpanded ? 'Collapse readiness checklist' : 'Expand readiness checklist'}
          >
            <span>{isExpanded ? 'Hide checklist' : 'View checklist'}</span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
            )}
          </button>
        </div>
      </aside>

      {/* Expanded Checklist Drawer / Modal */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsExpanded(false)}
            aria-hidden="true"
          />

          {/* Drawer / Sheet */}
          <div
            id="readiness-checklist-drawer"
            role="region"
            aria-label="Publish readiness detailed checklist"
            className="fixed bottom-14 left-0 right-0 z-50 max-w-[800px] mx-auto bg-surface border border-theme rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 max-h-[75vh] overflow-y-auto mb-2"
          >
            <div className="flex items-center justify-between pb-3 border-b border-theme mb-4">
              <div>
                <h3 className="font-heading font-semibold text-base text-ink">
                  Publish readiness checklist
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Evaluates critical factors that determine YouTube CTR and retention.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-muted hover:text-ink rounded-lg border border-theme bg-canvas focus-ring"
                aria-label="Close checklist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {fixes.map((item, index) => {
                const isPassed = item.status === 'ok';

                return (
                  <div
                    key={item.id || index}
                    className="p-3 rounded-xl border border-theme bg-canvas flex items-start justify-between gap-3"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-heading font-semibold text-xs text-ink">
                        {item.title}
                      </span>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.reason}
                      </p>
                    </div>

                    {/* Badge with Icon AND Text (never color alone) */}
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 border ${
                        isPassed
                          ? 'bg-surface border-success/40 text-success'
                          : 'bg-surface border-accent/40 text-accent'
                      }`}
                    >
                      {isPassed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                          <span>Good</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                          <span>Fix</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};
