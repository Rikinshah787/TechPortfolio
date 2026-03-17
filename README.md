# Rikin Shah — AI Avatar Portfolio Website with KG Base
<img width="1902" height="1022" alt="image" src="https://github.com/user-attachments/assets/2296dc44-162a-4aa2-92c7-7c83f0500003" />

A creative, fully responsive portfolio website featuring a custom 3D avatar, physics-based interactions, AI-powered chat, and scroll-driven animations.

**Live:** [rikin.tech](https://rikin.tech)

## Features

- **3D Avatar** — Programmatic Three.js character with cel-shaded toon materials, idle animations, blink system, and cursor-tracking eyes (GLTF + Draco compression)
- **AI Chat Avatar** — Conversational chat widget powered by Groq (Llama 3.3) with a built-in knowledge base, typewriter effect, and mobile-optimized bottom sheet with virtual keyboard handling
- **Physics-Based Tech Stack** — Interactive 3D spheres (React Three Fiber + Rapier physics) showcasing skills
- **Horizontal Scroll Work Section** — GSAP ScrollTrigger-driven horizontal gallery with inline video previews, progress bar, and native fullscreen
- **Scroll Animations** — Smooth section transitions, timeline career display, and parallax effects via GSAP
- **Fully Responsive** — Optimized for desktop, tablet, and all phone sizes (iPhone SE through Galaxy S24 Ultra)
- **Dark + Emerald Aesthetic** — Modern color scheme with glowing green accents and glass-morphism elements

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **3D & Animation** | Three.js, React Three Fiber, Rapier Physics, GSAP + ScrollTrigger |
| **AI Chat** | Groq API (Llama 3.3 70B), Vercel Serverless Functions |
| **Styling** | CSS (custom properties, media queries, safe-area-inset) |
| **Deployment** | Vercel, Git LFS (for .glb models) |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Rikinshah787/Portfolio-Website.git
cd Portfolio-Website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Start dev server
npm run dev
```

The site runs at `http://localhost:5173` by default.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LLM_PROVIDER` | LLM provider (`groq` or `openai`) | Yes |
| `GROQ_MODEL` | Groq model ID (default: `llama-3.3-70b-versatile`) | No |

> The chat widget falls back to a built-in keyword-matched knowledge base when no API key is configured.

## Project Structure

```
src/
  components/
    Landing.tsx          # Hero section with 3D avatar
    About.tsx            # About me section
    Work.tsx             # Horizontal scroll project gallery
    WorkImage.tsx        # Video/image preview with inline unmute
    Career.tsx           # Career timeline
    TechStack.tsx        # 3D physics ball pit
    ChatWidget.tsx       # AI chat widget
    Character/           # 3D avatar (Scene, Model, shaders)
    styles/              # Component CSS files
  index.css              # Global styles & CSS variables
api/
  chat.ts                # Vercel serverless function for AI chat
public/
  videos/                # Project demo videos
  images/                # Thumbnails and assets
  models/                # 3D avatar .glb files (Git LFS)
```

## Customizing for Your Own Portfolio

1. **Content:** Update the project data array in `Work.tsx`, career entries in `Career.tsx`, and about text in `About.tsx`
2. **Chat Knowledge:** Edit the `RIKIN_CONTEXT` string in `ChatWidget.tsx` and the `KNOWLEDGE` array in `api/chat.ts` with your own info
3. **3D Avatar:** Replace the `.glb` model in `public/models/` and adjust camera/lighting in `Character/Scene.tsx`
4. **Tech Stack Balls:** Update texture images in `public/images/` and the ball config in `TechStack.tsx`
5. **Colors:** Change `--accentColor` and `--backgroundColor` in `src/index.css`

## Scripts

```bash
npm run dev      # Start development server
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built by [Rikin Shah](https://linkedin.com/in/rikinshah787)
