import React from 'react';
import { Eye, CheckCircle2, AlertCircle, Sliders } from 'lucide-react';
import { evaluateSquintTest } from '../lib/contrast';

interface SquintTestProps {
  blurPx: number;
  onBlurChange: (value: number) => void;
  thumbnailText: string;
  thumbnailBg: string;
  thumbnailTextColor: string;
}

export const SquintTest: React.FC<SquintTestProps> = ({
  blurPx,
  onBlurChange,
  thumbnailText,
  thumbnailBg,
  thumbnailTextColor,
}) => {
  const result = evaluateSquintTest(
    thumbnailText,
    thumbnailBg,
    thumbnailTextColor,
    blurPx
  );

  const getAriaValueText = (val: number) => {
    if (val === 0) return '0 pixels, sharp preview';
    if (val <= 3) return `${val} pixels, light glance blur`;
    if (val <= 7) return `${val} pixels, medium squint simulation`;
    return `${val} pixels, heavy squint stress test`;
  };

  return (
    <section
      aria-labelledby="squint-test-heading"
      className="bg-surface rounded-2xl p-5 border border-theme card-shadow flex flex-col gap-4 transition-colors duration-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-accent" aria-hidden="true" />
          <h3
            id="squint-test-heading"
            className="font-heading font-semibold text-sm text-ink"
          >
            Squint test
          </h3>
          <span className="text-xs text-muted">
            · Simulates a 1-second mobile glance
          </span>
        </div>

        {/* Live Pass/Fail Badge with Icon AND Text */}
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border ${
            result.isPassed
              ? 'bg-canvas border-success/40 text-success'
              : 'bg-canvas border-accent/40 text-accent'
          }`}
        >
          {result.isPassed ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
          )}
          <span>{result.message}</span>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>0px (sharp)</span>
          <span className="font-mono text-ink tabular-nums font-semibold">
            {blurPx}px blur
          </span>
          <span>10px (heavy squint)</span>
        </div>

        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={blurPx}
          onChange={(e) => onBlurChange(Number(e.target.value))}
          aria-label="Thumbnail blur level for squint simulation"
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={blurPx}
          aria-valuetext={getAriaValueText(blurPx)}
          className="w-full h-2 bg-canvas border border-theme rounded-lg appearance-none cursor-pointer accent-accent focus-ring"
        />
      </div>

      {/* Detail description */}
      <p className="text-xs text-muted leading-relaxed">
        {result.detail}
      </p>
    </section>
  );
};
