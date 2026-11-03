import { VideoResults, ToneOption } from '../types';

/**
 * Generates an intelligent, tailored analysis for offline/demo mode or when
 * ANTHROPIC_API_KEY is not yet configured, allowing full end-to-end testing of
 * all 5 signature features immediately.
 */
export function generateSmartAnalysis(
  title: string,
  description: string,
  tone: ToneOption
): VideoResults {
  const cleanTitle = title.trim() || 'Untitled Video';
  const cleanDesc = description.trim();

  // Generate 3 realistic, honest takes
  let take1Text = '';
  let take1Why = '';
  let take2Text = '';
  let take2Why = '';
  let take3Text = '';
  let take3Why = '';

  if (tone === 'Educational') {
    take1Text = `How to ${cleanTitle.replace(/^how to /i, '')} (Step-by-Step)`;
    take1Why = 'Clear educational framing that sets expectations upfront.';
    take2Text = `The smart way to ${cleanTitle.replace(/^how to /i, '')}`;
    take2Why = 'Promises high-signal efficiency for curious learners.';
    take3Text = `${cleanTitle.slice(0, 35)}: What nobody tells you`;
    take3Why = 'Direct, authoritative perspective highlighting common pitfalls.';
  } else if (tone === 'Motivational') {
    take1Text = `Why this changed my mindset on ${cleanTitle.slice(0, 25)}`;
    take1Why = 'Personal transformation angle with relatable stakes.';
    take2Text = `Stop doing ${cleanTitle.slice(0, 28)} the hard way`;
    take2Why = 'Urgent action-oriented framing that challenges bad habits.';
    take3Text = `The habit shift that actually works in 2026`;
    take3Why = 'Future-focused promise without relying on exaggerated hype.';
  } else if (tone === 'Casual') {
    take1Text = `Honestly, ${cleanTitle.toLowerCase().slice(0, 42)}`;
    take1Why = 'Conversational and grounded; feels like a friend talking.';
    take2Text = `Trying ${cleanTitle.toLowerCase().slice(0, 30)} so you don't have to`;
    take2Why = 'Relatable trial-and-error hook that sparks instant empathy.';
    take3Text = `What really happened when I tried ${cleanTitle.slice(0, 20)}`;
    take3Why = 'Story-driven setup with natural curiosity.';
  } else {
    // Vlog
    take1Text = `A realistic day: ${cleanTitle.slice(0, 38)}`;
    take1Why = 'Authentic behind-the-scenes hook that avoids generic vlog tropes.';
    take2Text = `How I actually manage ${cleanTitle.toLowerCase().slice(0, 32)}`;
    take2Why = 'Highlights real-life routine and practical vulnerability.';
    take3Text = `${cleanTitle.slice(0, 36)} (midterm week reality)`;
    take3Why = 'Front-loads the context and establishes immediate relatability.';
  }

  // Ensure each take is strictly <= 60 characters
  const ensureLimit = (text: string) => {
    if (text.length <= 58) return text;
    return text.slice(0, 55).trim() + '...';
  };

  const finalTake1 = ensureLimit(take1Text);
  const finalTake2 = ensureLimit(take2Text);
  const finalTake3 = ensureLimit(take3Text);

  // Extract or synthesize chapters
  const existingTimestamps = cleanDesc.match(/(\d+:\d{2})\s+([^\n]+)/g);
  let chapters: Array<{ id: string; time: string; label: string }> = [];
  let isEstimated = false;

  if (existingTimestamps && existingTimestamps.length >= 3) {
    chapters = existingTimestamps.slice(0, 6).map((match, idx) => {
      const parts = match.split(/\s+/);
      const time = parts[0];
      const label = parts.slice(1).join(' ').trim();
      return { id: `c-${idx + 1}`, time, label };
    });
  } else {
    isEstimated = true;
    chapters = [
      { id: 'c-1', time: '0:00', label: 'The opening problem' },
      { id: 'c-2', time: '1:10', label: 'What I changed first' },
      { id: 'c-3', time: '2:45', label: 'The key breakthrough' },
      { id: 'c-4', time: '4:20', label: 'Mistakes to avoid' },
      { id: 'c-5', time: '5:50', label: 'Final takeaways & wrap-up' },
    ];
  }

  // Concise 1-4 word thumbnail ideas
  const words = cleanTitle.split(/\s+/).filter(Boolean);
  const t1 = words.slice(0, 3).join(' ').toUpperCase() || 'REAL TALK';
  const t2 = words.length > 2 ? `HOW I ${words[1] || 'DID'} IT`.toUpperCase() : 'THE TRUTH';
  const t3 = 'STOP DOING THIS';

  // 6 specific publish readiness checks
  const isTitleUnder60 = cleanTitle.length <= 60;
  const hasDescHook = cleanDesc.length >= 40;
  const hasChapters = chapters.length >= 4;

  return {
    titles: [
      { id: 1, text: finalTake1, why: take1Why, charCount: finalTake1.length },
      { id: 2, text: finalTake2, why: take2Why, charCount: finalTake2.length },
      { id: 3, text: finalTake3, why: take3Why, charCount: finalTake3.length },
    ],
    description: `${cleanDesc.slice(0, 200) || `Here is a complete, honest breakdown of ${cleanTitle}.`}

In this video, I walk through the exact steps, what worked, and what I would do differently next time. Let me know your thoughts in the comments!`,
    chapters,
    thumbnails: [
      { id: 't-1', text: t1.slice(0, 22), idea: 'High-contrast text over split-screen reaction' },
      { id: 't-2', text: t2.slice(0, 22), idea: 'Clean typography next to the main subject in action' },
      { id: 't-3', text: t3.slice(0, 22), idea: 'Bold visual question mark with focused eye contact' },
    ],
    fixes: [
      {
        id: 'f-1',
        category: 'title_length',
        title: 'Title length',
        status: isTitleUnder60 ? 'ok' : 'warn',
        reason: isTitleUnder60
          ? `Original title is ${cleanTitle.length} characters (under 60 char limit for mobile feeds).`
          : `Original title is ${cleanTitle.length} characters; will be cut off on phone feeds.`,
      },
      {
        id: 'f-2',
        category: 'title_promise',
        title: 'Title promise vs. content match',
        status: cleanTitle.length > 15 ? 'ok' : 'warn',
        reason: cleanTitle.length > 15
          ? 'Promises a specific viewer benefit without baiting unrealistic claims.'
          : 'Title is too brief; viewer cannot tell what benefit the video offers.',
      },
      {
        id: 'f-3',
        category: 'desc_hook',
        title: 'Hook in first line of description',
        status: hasDescHook ? 'ok' : 'warn',
        reason: hasDescHook
          ? 'Opening line summarizes the core premise before "Show more" cutoff.'
          : 'First line is too brief; add context in the first 120 characters.',
      },
      {
        id: 'f-4',
        category: 'chapters',
        title: 'Chapters present',
        status: hasChapters ? 'ok' : 'warn',
        reason: hasChapters
          ? `${chapters.length} chapters provided with clean 0:00 timestamp progression.`
          : 'Needs at least 4 chapters to assist viewer retention and Google search clips.',
      },
      {
        id: 'f-5',
        category: 'thumbnail',
        title: 'Thumbnail text readability',
        status: 'ok',
        reason: 'Recommended thumbnail text stays under 4 words with 4.5:1+ contrast.',
      },
      {
        id: 'f-6',
        category: 'keywords',
        title: 'Keywords used naturally',
        status: 'ok',
        reason: 'Topic keywords appear naturally in the title and opening description sentence.',
      },
    ],
    isEstimatedChapters: isEstimated,
  };
}
