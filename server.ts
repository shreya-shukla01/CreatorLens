import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '2mb' }));

interface ImproveRequestBody {
  title?: string;
  description?: string;
  tone?: 'Casual' | 'Educational' | 'Motivational' | 'Vlog';
}

interface TitleItem {
  text: string;
  why: string;
}

interface ChapterItem {
  time: string;
  label: string;
}

interface ThumbnailItem {
  text: string;
  idea: string;
}

interface FixItem {
  status: 'ok' | 'warn';
  text: string;
}

interface ImproveResponseBody {
  titles: TitleItem[];
  description: string;
  chapters: ChapterItem[];
  thumbnails: ThumbnailItem[];
  fixes: FixItem[];
}

// POST /api/improve - AI-powered YouTube video optimization
app.post('/api/improve', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title = '', description = '', tone = 'Vlog' } = req.body as ImproveRequestBody;
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Validation per specification:
    // require title of at least 3 chars OR description of at least 20 chars;
    // title max 200; description max 12,000;
    if (trimmedTitle.length < 3 && trimmedDescription.length < 20) {
      res.status(400).json({
        error: 'Add a title of at least 3 characters or paste a description of at least 20 characters.',
      });
      return;
    }

    if (trimmedTitle.length > 200) {
      res.status(400).json({
        error: 'Title must be 200 characters or fewer.',
      });
      return;
    }

    if (trimmedDescription.length > 12000) {
      res.status(400).json({
        error: 'Description must be 12,000 characters or fewer.',
      });
      return;
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: 'Anthropic API key is missing. Please set ANTHROPIC_API_KEY in your environment or .env file.',
        code: 'MISSING_API_KEY',
      });
      return;
    }

    const systemPrompt = `You are CreatorLens, an expert YouTube growth editor for small creators. Return ONLY valid JSON (no markdown, no backticks) with this exact shape:
{"titles":[{"text":"","why":""}],"description":"","chapters":[{"time":"0:00","label":""}],"thumbnails":[{"text":"","idea":""}],"fixes":[{"status":"ok|warn","text":""}]}
Rules: exactly 3 titles, each under 60 characters, honest (no clickbait lies); 'why' is one short sentence. Description: 2 to 3 short paragraphs, hook in the first line, natural keywords, no hashtag spam. Chapters: 4 to 7 items; if no transcript or timestamps are given, create sensible estimated timestamps starting at 0:00. Thumbnails: exactly 3, 'text' max 4 words, 'idea' is one visual suggestion. Fixes: exactly 6 items checking the ORIGINAL input (title length, promise vs content, description hook, chapters, thumbnail readability, keywords); 'ok' means already good, 'warn' means needs work; one line each. Match the requested tone. Reply in the same language as the input.`;

    const userMessage = `Tone: ${tone}\nCurrent title: ${trimmedTitle}\nDescription / transcript:\n${trimmedDescription}`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5-5',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('Anthropic API upstream error:', anthropicResponse.status, errText);
      res.status(502).json({ error: 'The AI could not finish. Try again.' });
      return;
    }

    const anthropicData = (await anthropicResponse.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const rawContent = anthropicData.content?.find((c) => c.type === 'text')?.text || '';

    // Strip code fences if present
    const cleanedJson = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    let parsed: ImproveResponseBody;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch (parseErr) {
      console.error('Failed to parse AI response JSON:', parseErr, rawContent);
      res.status(502).json({ error: 'The AI could not finish. Try again.' });
      return;
    }

    // Validate expected structure and counts
    if (
      !Array.isArray(parsed.titles) ||
      parsed.titles.length !== 3 ||
      typeof parsed.description !== 'string' ||
      !Array.isArray(parsed.chapters) ||
      parsed.chapters.length < 4 ||
      parsed.chapters.length > 7 ||
      !Array.isArray(parsed.thumbnails) ||
      parsed.thumbnails.length !== 3 ||
      !Array.isArray(parsed.fixes) ||
      parsed.fixes.length !== 6
    ) {
      console.error('AI response validation failed structure checks:', parsed);
      res.status(502).json({ error: 'The AI could not finish. Try again.' });
      return;
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error('Unexpected error in /api/improve:', error);
    res.status(502).json({ error: 'The AI could not finish. Try again.' });
  }
});

// Reject non-POST requests to /api/improve with 405
app.all('/api/improve', (_req: Request, res: Response) => {
  res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'CreatorLens API' });
});

async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorLens server running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
