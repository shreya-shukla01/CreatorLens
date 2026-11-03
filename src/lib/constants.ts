import { VideoResults, ToneOption } from '../types';

export const SURFACE_LIMITS = {
  phone: 52, // Typical 2 lines on mobile feed before truncation
  desktop: 62, // Typical 2 lines on desktop search snippet
  tv: 38, // 1 line on TV cards
} as const;

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  defaultTextColor: string;
  label: string;
}

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    id: 'navy',
    name: 'Studio Navy',
    hex: '#1E293B',
    defaultTextColor: '#FFFFFF',
    label: 'Dark neutral with high contrast',
  },
  {
    id: 'coral',
    name: 'Warm Coral',
    hex: '#C2410C',
    defaultTextColor: '#FFFFFF',
    label: 'Energetic warm tone',
  },
  {
    id: 'emerald',
    name: 'Deep Forest',
    hex: '#065F46',
    defaultTextColor: '#FFFFFF',
    label: 'Calm authoritative green',
  },
  {
    id: 'slate',
    name: 'Carbon Dark',
    hex: '#0F172A',
    defaultTextColor: '#FFFFFF',
    label: 'Ultra-dark contrast slate',
  },
];

export const ROTATING_LOADING_MESSAGES = [
  'Reading your title...',
  'Rewriting the description...',
  'Writing chapters...',
  'Drafting thumbnail text...',
];

export const TONE_OPTIONS: ToneOption[] = ['Casual', 'Educational', 'Motivational', 'Vlog'];

export const EXAMPLE_VIDEO = {
  title: 'My morning routine as a college student',
  description: `Here is what my typical 6:30 AM morning looks like during midterm season at university. From making matcha and reviewing flashcards to catching the morning bus and squeezing in a quick workout. Let me know in the comments how your semester is going!

0:00 Waking up at 6:30 AM
1:15 Matcha and hydration
2:45 Quick study session
4:30 Getting ready and outfit
6:00 Commute to campus`,
  tone: 'Vlog' as ToneOption,
  thumbnailText: '6:30 AM REALITY',
  thumbnailBg: '#1E293B',
  thumbnailTextColor: '#FFFFFF',
};

export const INITIAL_RESULTS: VideoResults = {
  titles: [
    {
      id: 1,
      text: 'A realistic 6:30 AM college morning routine',
      why: 'More specific and relatable than the original generic title.',
      charCount: 43,
    },
    {
      id: 2,
      text: 'How I actually survive morning classes in college',
      why: 'Curiosity-driven hook that highlights the student struggle.',
      charCount: 49,
    },
    {
      id: 3,
      text: 'College morning routine: midterms week reality',
      why: 'Front-loads the topic and adds timely stakes.',
      charCount: 46,
    },
  ],
  description: `A realistic look into my 6:30 AM college morning routine during midterm season. Watch how I balance study blocks, hydration, and catching the campus bus without burning out.

Drop your own morning essentials in the comments below!`,
  chapters: [
    { id: 'c-1', time: '0:00', label: 'Waking up at 6:30 AM' },
    { id: 'c-2', time: '1:15', label: 'Matcha and hydration' },
    { id: 'c-3', time: '2:45', label: 'Quick study session' },
    { id: 'c-4', time: '4:30', label: 'Getting ready and outfit' },
    { id: 'c-5', time: '6:00', label: 'Commute to campus' },
  ],
  thumbnails: [
    { id: 't-1', text: '6:30 AM REALITY', idea: 'Split-screen alarm clock and matcha mug' },
    { id: 't-2', text: 'HOW I SURVIVE', idea: 'Tired morning face holding handwritten study notes' },
    { id: 't-3', text: 'COLLEGE MORNING', idea: 'Sunlight through dorm window with backpack ready' },
  ],
  fixes: [
    {
      id: 'f-1',
      category: 'title_length',
      title: 'Title length',
      status: 'ok',
      reason: 'Under 60 characters so it fits on mobile feed without truncation.',
    },
    {
      id: 'f-2',
      category: 'title_promise',
      title: 'Title promise vs. content match',
      status: 'warn',
      reason: 'Original title is generic. Adding a specific hook increases CTR.',
    },
    {
      id: 'f-3',
      category: 'desc_hook',
      title: 'Hook in first line of description',
      status: 'ok',
      reason: 'The first sentence states the premise before the "Show more" cutoff.',
    },
    {
      id: 'f-4',
      category: 'chapters',
      title: 'Chapters present',
      status: 'ok',
      reason: '5 cleanly formatted timestamps make the video easy to scrub.',
    },
    {
      id: 'f-5',
      category: 'thumbnail',
      title: 'Thumbnail text readability',
      status: 'ok',
      reason: '3 words in bold type with 12.6:1 contrast ratio against the background.',
    },
    {
      id: 'f-6',
      category: 'keywords',
      title: 'Keywords used naturally',
      status: 'warn',
      reason: 'Add terms like "study vlog" or "midterm routine" for search indexing.',
    },
  ],
  isEstimatedChapters: false,
};
