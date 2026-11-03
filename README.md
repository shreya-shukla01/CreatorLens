# CreatorLens

> "See it before your viewers do."

CreatorLens is a web application that helps small and mid-size YouTube creators preview and improve a video's title, description, chapters, and thumbnail text **before publishing**, by showing the video the way viewers will actually see it in crowded feeds across Phone, Desktop, and TV.

---

## The Problem & Core Insight
Creators typically judge their video titles and thumbnails inside a quiet desktop form or content management text box. But viewers see tiny cards on 6-inch phone screens while scrolling at thumb-speed for approximately one second.

Titles get cut off with ellipses, thumbnail text becomes an unreadable blur, and creators only discover the issue after the initial click-through rate has already collapsed. CreatorLens makes feed reality visible and fixes it with AI.

---

## Five Signature Features

1. **Live Multi-Surface Feed Preview**:
   - Phone Feed (narrow card, 2-line title cutoff at 52 characters, avatar, and view stats)
   - Desktop Search Result (horizontal thumbnail, 2-line title cutoff at 62 characters, description snippet)
   - TV Home Tile (wide 16:9 cinematic card with single-line cutoff at 38 characters)
   - **Truncation Marker**: Explicitly marks where text cuts off and computes exact visible vs hidden characters.
   - **Before/After & Compare**: Toggle between original and AI Takes, or compare side-by-side.

2. **The Squint Test**:
   - Accessible slider blurring the thumbnail from `0px` (sharp) to `10px` (heavy squint).
   - Computes real-time WCAG 2.1 contrast ratio and word count discipline (fails if >4 words or contrast <4.5:1).
   - Simulates what a viewer perceives in a fraction of a second.

3. **AI Title Takes**:
   - Three honest, non-clickbait options tailored to video tone (Casual, Educational, Motivational, Vlog).
   - Live character length indicators (`52/60 chars · good` vs `long`).
   - One-click copy and instant swap into the live preview.

4. **Interactive Chapter Timeline & Description Editor**:
   - Scrubbable chapter timeline with editable markers (4 to 7 chapters).
   - Add, rename, and delete timestamps with an automated "Copy with chapters" exporter.
   - Description editor with an "Above the Fold" preview showing the first 2 lines visible before YouTube's "Show more" button.

5. **Publish Readiness Strip & Checklist**:
   - Pinned 6-segment status bar: "X of 6 checks passed".
   - Expandable checklist with "Good" and "Fix" badges (never relying on color alone).
   - Verifies title length, title promise vs. content, hook strength, chapter presence, thumbnail legibility, and natural keyword density.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend**: Express API server with Vite dev middleware (`server.ts`) hosting `POST /api/improve`.
- **AI Model**: Anthropic Claude `claude-sonnet-5-5` via secure server-side proxy.
- **Local Storage**: Client-side persistence for recent videos (last 5, deduplicated), dark/light theme, and drafts.

---

## Deploy to Vercel in 4 Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of CreatorLens"
   git push origin main
   ```

2. **Import Project into Vercel**:
   Go to [vercel.com](https://vercel.com), select **Add New Project**, and import your repository.

3. **Configure Environment Variable**:
   In the Vercel Project Settings > **Environment Variables**, add:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key (`sk-ant-...`).

4. **Deploy**:
   Click **Deploy**. Vercel will run `npm run build` and launch the applet with serverless API route compatibility.

---

## Local Development

1. Copy `.env.example` to `.env` and set your key:
   ```bash
   cp .env.example .env
   ```
2. Set `ANTHROPIC_API_KEY="your-api-key"` in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

---

## Design System Tokens
- **Light Theme**: Canvas `#F5F6F8`, Surface `#FFFFFF`, Ink `#14181F`, Muted `#5B6472`, Border `#E2E5EA`, Accent `#D93A22`, Success `#12794F`, Warning `#9A6500`.
- **Dark Theme**: Canvas `#0F1218`, Surface `#181C24`, Ink `#EEF0F4`, Muted `#9AA3B2`, Border `#2A303B`, Accent `#FF6B52`, Success `#4CD39A`, Warning `#F0B63D`.
- **Accent Rule**: The red-orange accent is treated strictly like a recording tally light: reserved for primary buttons, active tab indicators, and failing validation checks.
