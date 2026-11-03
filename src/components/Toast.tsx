import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 1800);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-ink text-surface rounded-xl shadow-lg border border-theme text-xs font-medium tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center shrink-0">
        <Check className="w-2.5 h-2.5 text-white stroke-[3]" aria-hidden="true" />
      </div>
      <span>{message}</span>
    </div>
  );
};
