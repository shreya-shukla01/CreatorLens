import React from 'react';
import { Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import { ToneOption } from '../types';
import { TONE_OPTIONS } from '../lib/constants';

interface InputPanelProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  tone: ToneOption;
  onToneChange: (tone: ToneOption) => void;
  onSubmit: () => void;
  onUseExample: () => void;
  isLoading: boolean;
  validationError: string | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  tone,
  onToneChange,
  onSubmit,
  onUseExample,
  isLoading,
  validationError,
}) => {
  const titleCharCount = title.length;
  const descCharCount = description.length;
  const isTitleOver60 = titleCharCount > 60;

  return (
    <aside
      aria-label="Video input parameters"
      className="w-full lg:w-[320px] shrink-0 bg-surface rounded-2xl p-5 border border-theme card-shadow flex flex-col gap-5 transition-colors duration-200"
    >
      <div>
        <h2 className="font-heading font-semibold text-base text-ink tracking-tight">
          Input details
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Paste your working title and description to preview how viewers see them.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        {/* Title Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="video-title-input"
              className="text-xs font-medium text-ink"
            >
              Working title
            </label>
            <span
              className={`text-[11px] font-mono tabular-nums ${
                isTitleOver60 ? 'text-warning font-semibold' : 'text-muted'
              }`}
              aria-live="polite"
            >
              {titleCharCount}/60 chars {isTitleOver60 ? '· long' : '· good'}
            </span>
          </div>
          <input
            id="video-title-input"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. My morning routine as a college student"
            maxLength={200}
            className="w-full px-3.5 py-2.5 text-sm bg-canvas border border-theme rounded-xl text-ink placeholder:text-muted/60 transition-colors duration-150 focus-ring"
          />
        </div>

        {/* Description / Transcript Textarea */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="video-description-input"
              className="text-xs font-medium text-ink"
            >
              Description / transcript
            </label>
            <span className="text-[11px] font-mono text-muted tabular-nums">
              {descCharCount.toLocaleString()} chars
            </span>
          </div>
          <textarea
            id="video-description-input"
            rows={5}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Paste your description, notes, or transcript here. Include timestamps like 0:00 Intro if available."
            maxLength={12000}
            className="w-full px-3.5 py-2.5 text-xs bg-canvas border border-theme rounded-xl text-ink placeholder:text-muted/60 resize-y min-h-[110px] leading-relaxed transition-colors duration-150 focus-ring"
          />
        </div>

        {/* Tone Selector */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink" id="tone-group-label">
            Video tone
          </span>
          <div
            role="radiogroup"
            aria-labelledby="tone-group-label"
            className="grid grid-cols-2 gap-1.5"
          >
            {TONE_OPTIONS.map((t) => {
              const isSelected = tone === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onToneChange(t)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all duration-150 focus-ring ${
                    isSelected
                      ? 'bg-canvas border-accent text-ink font-semibold'
                      : 'border-theme bg-surface text-muted hover:text-ink hover:bg-canvas'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Validation Error */}
        {validationError && (
          <div
            role="alert"
            className="flex items-start gap-2 p-3 rounded-xl bg-canvas border border-accent/40 text-xs text-ink"
          >
            <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full py-2.5 px-4 bg-accent hover:opacity-95 text-white font-medium text-sm rounded-xl transition-all duration-150 shadow-sm flex items-center justify-center gap-2 focus-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Working...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Improve my video</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onUseExample}
            disabled={isLoading}
            className="w-full py-2 px-3 bg-surface hover:bg-canvas text-muted hover:text-ink border border-theme text-xs font-medium rounded-xl transition-colors duration-150 flex items-center justify-center gap-1.5 focus-ring cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Use example</span>
          </button>
        </div>
      </form>
    </aside>
  );
};
