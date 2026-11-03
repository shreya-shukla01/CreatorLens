import { TruncationInfo, SurfaceMode } from '../types';
import { SURFACE_LIMITS } from './constants';

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB hex color.
 */
function getRelativeLuminance(hexColor: string): number {
  const cleanHex = hexColor.replace('#', '').trim();
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map((c) => c + c).join('')
    : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16) / 255;
  const g = parseInt(fullHex.substring(2, 4), 16) / 255;
  const b = parseInt(fullHex.substring(4, 6), 16) / 255;

  const transform = (val: number) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  };

  const R = transform(r);
  const G = transform(g);
  const B = transform(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates the WCAG contrast ratio between two hex colors.
 * Returns a number from 1 to 21 (e.g. 4.5).
 */
export function calculateContrastRatio(hex1: string, hex2: string): number {
  try {
    const lum1 = getRelativeLuminance(hex1);
    const lum2 = getRelativeLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    return Math.round(ratio * 10) / 10;
  } catch {
    return 10.0;
  }
}

/**
 * Counts words in a string, ignoring extraneous whitespace.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export interface SquintTestResult {
  isPassed: boolean;
  ratio: number;
  wordCount: number;
  message: string;
  detail: string;
}

/**
 * Evaluates squint test readability based on WCAG contrast (>= 4.5:1)
 * and maximum word count (<= 4 words).
 */
export function evaluateSquintTest(
  text: string,
  bgColor: string,
  textColor: string,
  blurPx: number
): SquintTestResult {
  const words = countWords(text);
  const ratio = calculateContrastRatio(bgColor, textColor);

  if (words === 0) {
    return {
      isPassed: false,
      ratio,
      wordCount: 0,
      message: 'No thumbnail text added',
      detail: 'Add 1 to 4 punchy words that highlight the core idea.',
    };
  }

  if (words > 4) {
    return {
      isPassed: false,
      ratio,
      wordCount: words,
      message: 'Hard to read: try fewer words',
      detail: `Contains ${words} words. Mobile viewers only glance for ~1 second. Keep it to 4 words maximum.`,
    };
  }

  if (ratio < 4.5) {
    return {
      isPassed: false,
      ratio,
      wordCount: words,
      message: 'Hard to read: low contrast',
      detail: `Contrast ratio is ${ratio}:1 (WCAG AA requires 4.5:1). Darken the background or brighten text.`,
    };
  }

  if (blurPx >= 8) {
    return {
      isPassed: true,
      ratio,
      wordCount: words,
      message: 'Readable at high squint',
      detail: `${words} words · ${ratio}:1 contrast. Remains legible even under heavy feed blur.`,
    };
  }

  return {
    isPassed: true,
    ratio,
    wordCount: words,
    message: 'Readable at a glance',
    detail: `${words} words · ${ratio}:1 contrast. Clear typography that stands out in crowded feeds.`,
  };
}

/**
 * Calculates truncation information for a title on a specific surface.
 */
export function calculateTruncation(title: string, surface: SurfaceMode): TruncationInfo {
  const limit = SURFACE_LIMITS[surface];
  const length = title.length;

  if (length <= limit) {
    return {
      limit,
      fits: true,
      visibleChars: title,
      cutOffChars: '',
      note: 'Fits fully',
    };
  }

  const visibleChars = title.slice(0, limit);
  const cutOffChars = title.slice(limit);

  return {
    limit,
    fits: false,
    visibleChars,
    cutOffChars,
    note: `Cut off after ${limit} characters on this surface`,
  };
}
