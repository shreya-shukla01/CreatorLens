/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  SurfaceMode,
  ToneOption,
  VideoResults,
  VideoProject,
  Chapter,
} from './types';
import {
  EXAMPLE_VIDEO,
  INITIAL_RESULTS,
  COLOR_SWATCHES,
} from './lib/constants';
import { generateSmartAnalysis } from './lib/generator';
import { TopBar } from './components/TopBar';
import { InputPanel } from './components/InputPanel';
import { PreviewHero } from './components/PreviewHero';
import { SquintTest } from './components/SquintTest';
import { TakesRail } from './components/TakesRail';
import { ChapterTimeline } from './components/ChapterTimeline';
import { DescriptionEditor } from './components/DescriptionEditor';
import { ReadinessStrip } from './components/ReadinessStrip';
import { HistoryDrawer } from './components/HistoryDrawer';
import { CompareModal } from './components/CompareModal';
import { Toast } from './components/Toast';
import { SkeletonPreview } from './components/SkeletonPreview';

export default function App() {
  // Theme state: defaults to light, checks localStorage or system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('creatorlens_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('creatorlens_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('creatorlens_theme', 'light');
    }
  }, [isDark]);

  // Main input state (prefilled with example on first visit)
  const [title, setTitle] = useState<string>(() => {
    return localStorage.getItem('creatorlens_last_title') || EXAMPLE_VIDEO.title;
  });
  const [description, setDescription] = useState<string>(() => {
    return localStorage.getItem('creatorlens_last_desc') || EXAMPLE_VIDEO.description;
  });
  const [tone, setTone] = useState<ToneOption>(() => {
    return (localStorage.getItem('creatorlens_last_tone') as ToneOption) || EXAMPLE_VIDEO.tone;
  });

  // Current active results state
  const [results, setResults] = useState<VideoResults>(INITIAL_RESULTS);
  const [selectedTakeIndex, setSelectedTakeIndex] = useState<number>(0);
  const [isShowingOriginal, setIsShowingOriginal] = useState<boolean>(false);

  // Surface view state: phone | desktop | tv
  const [surface, setSurface] = useState<SurfaceMode>('phone');

  // Thumbnail customizer & squint test state
  const [thumbnailText, setThumbnailText] = useState<string>(EXAMPLE_VIDEO.thumbnailText);
  const [thumbnailBg, setThumbnailBg] = useState<string>(EXAMPLE_VIDEO.thumbnailBg);
  const [thumbnailTextColor, setThumbnailTextColor] = useState<string>(EXAMPLE_VIDEO.thumbnailTextColor);
  const [thumbnailBlurPx, setThumbnailBlurPx] = useState<number>(0);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<{ message: string; canUseLocal: boolean } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isMobileInputCollapsed, setIsMobileInputCollapsed] = useState<boolean>(false);

  // History list (last 5 in localStorage)
  const [history, setHistory] = useState<VideoProject[]>(() => {
    try {
      const stored = localStorage.getItem('creatorlens_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse history:', e);
    }
    return [];
  });

  const previewRegionRef = useRef<HTMLDivElement>(null);

  // Save inputs to localStorage on changes
  useEffect(() => {
    localStorage.setItem('creatorlens_last_title', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('creatorlens_last_desc', description);
  }, [description]);

  useEffect(() => {
    localStorage.setItem('creatorlens_last_tone', tone);
  }, [tone]);

  // Toast trigger
  const showToast = (text: string) => {
    setToastMessage(text);
  };

  // Determine current title to display on surfaces
  const activeTake = results.titles[selectedTakeIndex];
  const displayTitle = isShowingOriginal ? title : (activeTake?.text || title);

  // Handle Form Submission / Improve Video
  const handleImproveVideo = async (forceLocal = false) => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    // Validation per specification
    if (trimmedTitle.length < 3 && trimmedDesc.length < 20) {
      setValidationError('Add a title (at least 3 characters) or paste a longer description (at least 20 characters).');
      return;
    }
    if (trimmedTitle.length > 200) {
      setValidationError('Title must be 200 characters or fewer.');
      return;
    }
    if (trimmedDesc.length > 12000) {
      setValidationError('Description must be 12,000 characters or fewer.');
      return;
    }

    setValidationError(null);
    setApiError(null);
    setIsLoading(true);

    try {
      if (forceLocal) {
        // Local generator for testing / demo
        await new Promise((res) => setTimeout(res, 800));
        const smartResults = generateSmartAnalysis(trimmedTitle, trimmedDesc, tone);
        applyNewResults(smartResults);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDesc,
          tone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 500 && errorData.code === 'MISSING_API_KEY') {
          setApiError({
            message: 'Anthropic API key is not configured in environment variables. You can add ANTHROPIC_API_KEY to your .env file or use Demo AI Mode to test immediately.',
            canUseLocal: true,
          });
        } else if (response.status === 400) {
          setValidationError(errorData.error || 'Please provide a valid title or description.');
        } else {
          setApiError({
            message: errorData.error || 'The AI could not finish. Try again.',
            canUseLocal: true,
          });
        }
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as VideoResults;
      applyNewResults(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setApiError({
        message: 'Check your connection and try again.',
        canUseLocal: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyNewResults = (newResults: VideoResults) => {
    setResults(newResults);
    setSelectedTakeIndex(0);
    setIsShowingOriginal(false);
    setIsMobileInputCollapsed(true);

    // If new thumbnail ideas exist, set the first one
    if (newResults.thumbnails?.[0]?.text) {
      setThumbnailText(newResults.thumbnails[0].text);
    }

    // Save to history (deduplicated by title, max 5)
    const newProject: VideoProject = {
      id: `proj-${Date.now()}`,
      timestamp: Date.now(),
      title: title.trim(),
      description: description.trim(),
      tone,
      selectedTakeIndex: 0,
      thumbnailText: newResults.thumbnails?.[0]?.text || thumbnailText,
      thumbnailBg,
      thumbnailTextColor,
      results: newResults,
    };

    setHistory((prev) => {
      const filtered = prev.filter((p) => p.title.toLowerCase() !== title.trim().toLowerCase());
      const updated = [newProject, ...filtered].slice(0, 5);
      localStorage.setItem('creatorlens_history', JSON.stringify(updated));
      return updated;
    });

    // Move focus to preview region
    if (previewRegionRef.current) {
      previewRegionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Use Example Data
  const handleUseExample = () => {
    setTitle(EXAMPLE_VIDEO.title);
    setDescription(EXAMPLE_VIDEO.description);
    setTone(EXAMPLE_VIDEO.tone);
    setThumbnailText(EXAMPLE_VIDEO.thumbnailText);
    setThumbnailBg(EXAMPLE_VIDEO.thumbnailBg);
    setThumbnailTextColor(EXAMPLE_VIDEO.thumbnailTextColor);
    setResults(INITIAL_RESULTS);
    setSelectedTakeIndex(0);
    setIsShowingOriginal(false);
    setValidationError(null);
    setApiError(null);
    showToast('Loaded example video');
  };

  // Restore from history
  const handleRestoreProject = (p: VideoProject) => {
    setTitle(p.title);
    setDescription(p.description);
    setTone(p.tone);
    setThumbnailText(p.thumbnailText);
    setThumbnailBg(p.thumbnailBg);
    setThumbnailTextColor(p.thumbnailTextColor);
    if (p.results) {
      setResults(p.results);
      setSelectedTakeIndex(p.selectedTakeIndex || 0);
    }
    showToast('Restored video from history');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('creatorlens_history');
    showToast('History cleared');
  };

  // Copy helper
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied');
    } catch {
      showToast('Copied');
    }
  };

  // Chapter operations
  const handleUpdateChapter = (id: string, time: string, label: string) => {
    setResults((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) => (c.id === id ? { ...c, time, label } : c)),
    }));
    showToast('Chapter updated');
  };

  const handleAddChapter = () => {
    const nextIdx = results.chapters.length + 1;
    const newChapter: Chapter = {
      id: `c-${Date.now()}`,
      time: '0:00',
      label: `Chapter ${nextIdx}`,
    };
    setResults((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
    showToast('Added chapter');
  };

  const handleDeleteChapter = (id: string) => {
    setResults((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((c) => c.id !== id),
    }));
    showToast('Chapter removed');
  };

  const handleCopyDescriptionWithChapters = () => {
    const formattedChapters = results.chapters
      .map((c) => `${c.time} ${c.label}`)
      .join('\n');
    const combined = `${results.description}\n\nChapters:\n${formattedChapters}`;
    copyToClipboard(combined);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col transition-colors duration-200">
      {/* Top Bar: Wordmark, Surface Segmented Control, Theme Toggle, History */}
      <TopBar
        surface={surface}
        onSurfaceChange={setSurface}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 pb-24 flex flex-col gap-6">
        {/* Hero Banner Intro */}
        <section className="flex flex-col gap-1 max-w-2xl">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink tracking-tight text-balance">
            Publish videos people actually click.
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Paste your title and description. See how viewers will see your video, then fix what gets cut off.
          </p>
        </section>

        {/* Global Error Banner */}
        {apiError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-surface border border-accent/40 card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-ink">Action required</span>
                <span className="text-muted">{apiError.message}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {apiError.canUseLocal && (
                <button
                  type="button"
                  onClick={() => handleImproveVideo(true)}
                  className="px-3 py-1.5 rounded-xl bg-accent text-white font-medium hover:opacity-95 transition-opacity focus-ring"
                >
                  Run Demo AI Analysis
                </button>
              )}
              <button
                type="button"
                onClick={() => handleImproveVideo(false)}
                className="px-3 py-1.5 rounded-xl border border-theme bg-canvas hover:bg-surface text-ink transition-colors focus-ring"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6 items-start">
          {/* Column 1: Input Panel (320px) */}
          <div className="flex flex-col gap-3">
            {/* Mobile collapsible toggle when results are active */}
            <div className="lg:hidden flex items-center justify-between p-3 rounded-xl bg-surface border border-theme">
              <span className="text-xs font-semibold text-ink">Video inputs</span>
              <button
                type="button"
                onClick={() => setIsMobileInputCollapsed((prev) => !prev)}
                className="text-xs text-muted hover:text-ink flex items-center gap-1 focus-ring px-2 py-1"
              >
                <span>{isMobileInputCollapsed ? 'Edit inputs' : 'Collapse'}</span>
                {isMobileInputCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className={`${isMobileInputCollapsed ? 'hidden lg:block' : 'block'}`}>
              <InputPanel
                title={title}
                onTitleChange={setTitle}
                description={description}
                onDescriptionChange={setDescription}
                tone={tone}
                onToneChange={setTone}
                onSubmit={() => handleImproveVideo(false)}
                onUseExample={handleUseExample}
                isLoading={isLoading}
                validationError={validationError}
              />
            </div>
          </div>

          {/* Column 2: Center Live Preview (Hero) & Tools */}
          <div
            ref={previewRegionRef}
            tabIndex={-1}
            className="flex flex-col gap-6 min-w-0"
            aria-live="polite"
          >
            {isLoading ? (
              <SkeletonPreview />
            ) : (
              <>
                {/* 5.1 Live Multi-Surface Preview */}
                <PreviewHero
                  surface={surface}
                  displayTitle={displayTitle}
                  originalTitle={title}
                  isShowingOriginal={isShowingOriginal}
                  onToggleBeforeAfter={() => setIsShowingOriginal((prev) => !prev)}
                  onOpenCompare={() => setIsCompareOpen(true)}
                  thumbnailText={thumbnailText}
                  onThumbnailTextChange={setThumbnailText}
                  thumbnailBg={thumbnailBg}
                  onThumbnailBgChange={setThumbnailBg}
                  thumbnailTextColor={thumbnailTextColor}
                  thumbnailBlurPx={thumbnailBlurPx}
                  thumbnailIdeas={results.thumbnails || []}
                  descriptionSnippet={results.description}
                  activeTake={activeTake}
                />

                {/* 5.2 Squint Test Slider */}
                <SquintTest
                  blurPx={thumbnailBlurPx}
                  onBlurChange={setThumbnailBlurPx}
                  thumbnailText={thumbnailText}
                  thumbnailBg={thumbnailBg}
                  thumbnailTextColor={thumbnailTextColor}
                />

                {/* Mobile/Tablet Takes Rail (Visible here if on small screen) */}
                <div className="lg:hidden">
                  <TakesRail
                    takes={results.titles}
                    selectedTakeIndex={selectedTakeIndex}
                    onSelectTake={(idx) => {
                      setSelectedTakeIndex(idx);
                      setIsShowingOriginal(false);
                      showToast(`Applied Take ${idx + 1}`);
                    }}
                    onCopyTake={copyToClipboard}
                    onOpenCompare={() => setIsCompareOpen(true)}
                  />
                </div>

                {/* 5.4 Chapter Timeline Scrubber */}
                <ChapterTimeline
                  chapters={results.chapters}
                  isEstimated={results.isEstimatedChapters}
                  onUpdateChapter={handleUpdateChapter}
                  onAddChapter={handleAddChapter}
                  onDeleteChapter={handleDeleteChapter}
                  onCopyAllWithChapters={handleCopyDescriptionWithChapters}
                />

                {/* 5.4b Description Editor */}
                <DescriptionEditor
                  description={results.description}
                  onChange={(val) => setResults((prev) => ({ ...prev, description: val }))}
                  onCopy={() => copyToClipboard(results.description)}
                />
              </>
            )}
          </div>

          {/* Column 3: Takes Rail (320px on Desktop) */}
          <div className="hidden lg:block">
            <TakesRail
              takes={results.titles}
              selectedTakeIndex={selectedTakeIndex}
              onSelectTake={(idx) => {
                setSelectedTakeIndex(idx);
                setIsShowingOriginal(false);
                showToast(`Applied Take ${idx + 1}`);
              }}
              onCopyTake={copyToClipboard}
              onOpenCompare={() => setIsCompareOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* 5.5 Always-Visible Bottom Publish Readiness Strip */}
      <ReadinessStrip fixes={results.fixes} />

      {/* Modals & Drawers */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        originalTitle={title}
        selectedTake={activeTake || results.titles[0]}
        surface={surface}
        thumbnailText={thumbnailText}
        thumbnailBg={thumbnailBg}
        thumbnailTextColor={thumbnailTextColor}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectProject={handleRestoreProject}
        onClearHistory={handleClearHistory}
      />

      {/* Copy Feedback Toast */}
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  );
}
