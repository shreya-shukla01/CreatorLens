import React, { useState } from 'react';
import { Plus, Trash2, Copy, Clock, Edit2, Check, AlertCircle } from 'lucide-react';
import { Chapter } from '../types';

interface ChapterTimelineProps {
  chapters: Chapter[];
  isEstimated: boolean;
  onUpdateChapter: (id: string, time: string, label: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onCopyAllWithChapters: () => void;
}

export const ChapterTimeline: React.FC<ChapterTimelineProps> = ({
  chapters,
  isEstimated,
  onUpdateChapter,
  onAddChapter,
  onDeleteChapter,
  onCopyAllWithChapters,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const startEdit = (ch: Chapter) => {
    setEditingId(ch.id);
    setEditTime(ch.time);
    setEditLabel(ch.label);
  };

  const saveEdit = (id: string) => {
    if (editLabel.trim()) {
      onUpdateChapter(id, editTime.trim() || '0:00', editLabel.trim());
    }
    setEditingId(null);
  };

  return (
    <section
      aria-labelledby="chapter-timeline-heading"
      className="bg-surface rounded-2xl p-5 border border-theme card-shadow flex flex-col gap-4 transition-colors duration-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
          <h3
            id="chapter-timeline-heading"
            className="font-heading font-semibold text-sm text-ink"
          >
            Video chapters
          </h3>
          <span className="text-xs text-muted">
            · {chapters.length} markers
          </span>
        </div>

        <div className="flex items-center gap-2">
          {chapters.length < 8 && (
            <button
              type="button"
              onClick={onAddChapter}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-theme bg-canvas hover:bg-surface text-ink transition-colors focus-ring"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add chapter</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCopyAllWithChapters}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-accent text-white hover:opacity-95 transition-opacity focus-ring"
            title="Copy description text plus formatted chapter timestamps"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Copy with chapters</span>
          </button>
        </div>
      </div>

      {/* Note if timestamps were estimated */}
      {isEstimated && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-canvas border border-theme text-xs text-muted">
          <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" aria-hidden="true" />
          <span>Estimated timestamps. Adjust to match your video.</span>
        </div>
      )}

      {/* Horizontal Visual Scrubber Line */}
      <div className="relative w-full py-3">
        <div className="w-full h-1.5 bg-canvas rounded-full border border-theme overflow-hidden flex">
          {chapters.map((_, i) => (
            <div
              key={i}
              className="h-full border-r border-theme last:border-r-0"
              style={{ width: `${100 / chapters.length}%` }}
            />
          ))}
        </div>
      </div>

      {/* Chapter Marker Cards Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {chapters.map((ch, index) => {
          const isEditing = editingId === ch.id;

          if (isEditing) {
            return (
              <div
                key={ch.id}
                className="p-2.5 rounded-xl border border-accent bg-canvas flex items-center gap-2"
              >
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  placeholder="0:00"
                  className="w-16 px-2 py-1 text-xs font-mono font-semibold bg-surface border border-theme rounded text-ink focus-ring"
                />
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Chapter title"
                  className="flex-1 px-2 py-1 text-xs bg-surface border border-theme rounded text-ink focus-ring"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(ch.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => saveEdit(ch.id)}
                  className="p-1 rounded bg-surface border border-theme hover:bg-canvas text-success focus-ring"
                  title="Save chapter"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={ch.id}
              className="p-2.5 rounded-xl border border-theme bg-canvas hover:bg-surface flex items-center justify-between gap-2 group transition-colors"
            >
              <button
                type="button"
                onClick={() => startEdit(ch)}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left focus-ring rounded"
                title="Click to rename"
              >
                <span className="font-mono text-xs font-semibold text-accent px-1.5 py-0.5 rounded bg-surface border border-theme/60 shrink-0">
                  {ch.time}
                </span>
                <span className="text-xs text-ink truncate font-medium">
                  {ch.label}
                </span>
              </button>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => startEdit(ch)}
                  className="p-1 text-muted hover:text-ink rounded focus-ring"
                  title="Rename chapter"
                  aria-label={`Rename chapter ${ch.label}`}
                >
                  <Edit2 className="w-3 h-3" />
                </button>

                {chapters.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onDeleteChapter(ch.id)}
                    className="p-1 text-muted hover:text-accent rounded focus-ring"
                    title="Delete chapter"
                    aria-label={`Delete chapter ${ch.label}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
