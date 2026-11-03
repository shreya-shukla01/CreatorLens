import React from 'react';
import { X, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { VideoProject } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: VideoProject[];
  onSelectProject: (project: VideoProject) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectProject,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-surface h-full border-l border-theme shadow-2xl flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-theme">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
            <h3
              id="history-drawer-title"
              className="font-heading font-semibold text-base text-ink"
            >
              Recent videos
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted hover:text-ink rounded-lg border border-theme bg-canvas focus-ring"
            aria-label="Close history"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of projects */}
        <div className="flex-1 py-4 flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted text-xs flex flex-col items-center gap-2">
              <Clock className="w-8 h-8 opacity-40" />
              <span>No recent videos saved yet.</span>
              <span>Videos you analyze will appear here (last 5).</span>
            </div>
          ) : (
            history.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  onSelectProject(project);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-theme bg-canvas hover:bg-surface text-left transition-all duration-150 flex flex-col gap-1.5 group focus-ring cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted">
                    {new Date(project.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-[11px] font-medium text-muted px-2 py-0.5 rounded bg-surface border border-theme/60">
                    {project.tone}
                  </span>
                </div>

                <h4 className="font-heading font-semibold text-sm text-ink group-hover:text-accent transition-colors line-clamp-2">
                  {project.title}
                </h4>

                <div className="flex items-center gap-1 text-[11px] text-muted mt-1">
                  <span>Restore inputs and AI results</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-theme flex items-center justify-between">
            <span className="text-xs text-muted">
              {history.length} of 5 saved
            </span>
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted hover:text-accent border border-theme rounded-lg bg-canvas transition-colors focus-ring"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear history</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
