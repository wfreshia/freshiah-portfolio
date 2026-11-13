# Freshiah Wangari Mwaura – Portfolio
React + TypeScript + Tailwind CSS + Lucide + Framer Motion (Vite).

## Run locally
Requires Node.js 18+.
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Edit content
- **src/data.ts** – profile, projects, skills, experience, interests (certifications are stored but hidden until evidenced).
  - Projects: set `repo`, `demo`, `tech`, `contribution`, `screenshots` (e.g. `['/shots/finance-1.png']`, files in `public/shots/`).
  - Photo: put `profile.jpg` in `public/` and set `photo: '/profile.jpg'`.
- **public/Freshiah_Mwaura_CV.pdf** – replace with your latest CV (same filename).

## Deploy (free)
- **Vercel:** push to GitHub → vercel.com → Import → framework "Vite" → Deploy.
- **Netlify:** build command `npm run build`, publish directory `dist`.
- **GitHub Pages:** add `base: '/repo-name/'` in vite.config.ts, build, publish `dist`.

## Notes
The contact form opens the visitor's email app (mailto). For in-page sending, connect a service such as Formspree or EmailJS.
