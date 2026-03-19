# Mood Tracker

## Project Overview
Mood Tracker is a modern web application that lets users log their daily emotions using expressive emojis, visualize mood trends over time, and receive AI‑powered wellness tips. The app emphasizes privacy, offering secure authentication and private data storage, while also providing data export capabilities for personal analysis.

### Key Features
- **Log Daily Mood** – Choose from a curated set of emojis to record how you feel each day.  
- **Trend Visualization** – Interactive charts (via Recharts) display mood patterns over selectable time ranges.  
- **AI‑Generated Wellness Tips** – OpenAI generates personalized suggestions based on your mood history.  
- **Secure Authentication** – Supabase handles user sign‑up, login, and protected data storage.  
- **Data Export** – Export your mood log as a CSV file for offline analysis.  

### Tech Stack
- **Framework:** Next.js 14 (App Router)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS 3.4  
- **Database & Auth:** Supabase  
- **Charts:** Recharts  
- **AI:** OpenAI API  
- **Hosting:** Vercel  

## Getting Started

### Prerequisites
- Node.js ≥ 18  
- npm ≥ 9 (or Yarn/PNPM)  
- A Supabase project (for auth & database)  
- OpenAI API key  

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mood-tracker.git
cd mood-tracker

# Install dependencies
npm install
# or using Yarn
# yarn install
```

### Environment Variables
Create a `.env.local` file at the project root and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key   # required for server‑side operations
OPENAI_API_KEY=your-openai-api-key
```

> **Note:**  
> - `NEXT_PUBLIC_` prefixed variables are exposed to the client.  
> - Keep `SUPABASE_SERVICE_ROLE_KEY` secret; do not commit it to version control.  

### Running Locally

```bash
npm run dev
# or
# yarn dev
```

Open `http://localhost:3000` in your browser. The app will automatically reload on code changes.

### Building for Production

```bash
npm run build
npm start
# or
# yarn build
# yarn start
```

## Deployment Guide (Vercel)

1. **Create a Vercel Account** – Sign up at https://vercel.com if you haven’t already.  
2. **Import Repository** – Connect your GitHub (or GitLab/Bitbucket) repository and select the `mood-tracker` project.  
3. **Configure Build Settings**  
   - **Framework Preset:** Next.js  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `.next` (auto‑detected)  
4. **Add Environment Variables**  
   In the Vercel dashboard → *Project Settings* → *Environment Variables*, add the same keys defined in `.env.local`. Mark them as **Production** (and optionally **Preview**/**Development**).  
5. **Deploy** – Click *Deploy*; Vercel will run the build and provide a live URL. Subsequent pushes to the main branch trigger automatic redeploys.  

### Optional: Custom Domain
- In Vercel, go to *Domains* → *Add* and follow the DNS configuration steps to point your own domain to the deployed app.

## Project Structure (high‑level)

```
src/
 ├─ app/                # Next.js App Router pages (/, /login, /dashboard, …)
 ├─ components/         # Reusable UI components (EmojiPicker, ChartCard, …)
 ├─ lib/                # Supabase client, OpenAI wrapper, utility functions
 ├─ styles/             # Tailwind globals
 └─ types/              # TypeScript interfaces & enums
public/                  # Static assets (icons, favicons)
```

## Scripts

| Script          | Description                                 |
|-----------------|---------------------------------------------|
| `dev`           | Run the development server (`next dev`).    |
| `build`         | Compile the app for production (`next build`). |
| `start`         | Start the production server (`next start`). |
| `lint`          | Run ESLint (if configured).                 |
| `type-check`    | Run TypeScript type checking (`tsc --noEmit`). |

## Contributing
1. Fork the repository.  
2. Create a feature branch (`git checkout -b feature/awesome-feature`).  
3. Commit your changes with clear messages.  
4. Open a Pull Request targeting the `main` branch.  

Please ensure linting and type checks pass before submitting.

## License
This project is licensed under the MIT License. See `LICENSE` for details.