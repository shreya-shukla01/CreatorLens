import React from 'react';
import { FileText, Copy, Info } from 'lucide-react';

interface DescriptionEditorProps {
  description: string;
  onChange: (value: string) => void;
  onCopy: () => void;
}

export const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
  description,
  onChange,
  onCopy,
}) => {
  const charCount = description.length;
  // First 2 lines preview
  const lines = description.split('\n').filter(Boolean);
  const hookPreview = lines.slice(0, 2).join(' ');

  return (
    <section
      aria-labelledby="desc-editor-heading"
      className="bg-surface rounded-2xl p-5 border border-theme card-shadow flex flex-col gap-4 transition-colors duration-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" aria-hidden="true" />
          <h3
            id="desc-editor-heading"
            className="font-heading font-semibold text-sm text-ink"
          >
            Optimized description
          </h3>
          <span className="text-xs text-muted font-mono tabular-nums">
            · {charCount.toLocaleString()} chars
          </span>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-theme bg-canvas hover:bg-surface text-ink transition-colors focus-ring"
        >
          <Copy className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
          <span>Copy description</span>
        </button>
      </div>

      {/* "Above the Fold" Hook Inspector */}
      <div className="p-3 rounded-xl bg-canvas border border-theme text-xs flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 font-medium text-ink">
          <Info className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
          <span>Above the fold (visible before &ldquo;Show more&rdquo;):</span>
        </div>
        <p className="text-muted text-xs italic pl-5 leading-relaxed line-clamp-2">
          &ldquo;{hookPreview || 'Add an opening hook to captivate viewers...'}&rdquo;
        </p>
      </div>

      {/* Editable Textarea */}
      <div className="flex flex-col gap-1">
        <textarea
          rows={5}
          value={description}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Optimized video description"
          className="w-full px-3.5 py-2.5 text-xs bg-canvas border border-theme rounded-xl text-ink leading-relaxed transition-colors focus-ring font-normal"
          placeholder="Video description..."
        />
        <span className="text-[11px] text-muted text-right">
          The first 2 lines are what shows before &ldquo;Show more&rdquo;.
        </span>
      </div>
    </section>
  );
};
