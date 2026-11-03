export type SurfaceMode = 'phone' | 'desktop' | 'tv';

export type ToneOption = 'Casual' | 'Educational' | 'Motivational' | 'Vlog';

export interface TitleTake {
  id: number;
  text: string;
  why: string;
  charCount: number;
}

export interface Chapter {
  id: string;
  time: string;
  label: string;
}

export interface ThumbnailIdea {
  id: string;
  text: string;
  idea: string;
}

export interface ReadinessCheck {
  id: string;
  category: 'title_length' | 'title_promise' | 'desc_hook' | 'chapters' | 'thumbnail' | 'keywords';
  title: string;
  status: 'ok' | 'warn';
  reason: string;
}

export interface VideoResults {
  titles: TitleTake[];
  description: string;
  chapters: Chapter[];
  thumbnails: ThumbnailIdea[];
  fixes: ReadinessCheck[];
  isEstimatedChapters: boolean;
}

export interface VideoProject {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  tone: ToneOption;
  selectedTakeIndex: number;
  thumbnailText: string;
  thumbnailBg: string;
  thumbnailTextColor: string;
  results: VideoResults;
}

export interface TruncationInfo {
  limit: number;
  fits: boolean;
  visibleChars: string;
  cutOffChars: string;
  note: string;
}
