# 🌸 PETALINK

An interactive, premium digital bouquet builder designed for creating and sharing personalized floral arrangements with embedded multimedia links. PETALINK features custom oil-painted flower assets, responsive layouts, glassmorphic UI cards, and an interactive typewriter-style digital postcard.

---

## ✨ Features

- **💐 Custom Digital Bouquet Builder**: Select from high-quality oil-painted flower variations, wraps (Classic, Blush Pink, Red), and greenery foliage (Baby's Breath, Wax Flower, Eucalyptus).
- **🎨 Interactive Arrangement Canvas**: Drag, scale, rotate, and place botanical assets dynamically to craft the perfect composition.
- **💌 Retro Typewriter Postcard**: Type personalized messages using retro fonts with interactive visual fields mapped perfectly on top of physical-style postcard assets.
- **🔗 Contextual Flower Links**: Senders can attach custom URLs (e.g., a Spotify playlist, YouTube video, or digital letter) to individual flowers. Flowers with links show a glowing indicator badge.
- **📲 Direct Web Share**: Share bouquets directly to supported mobile and desktop applications using the native Web Share API (with a clipboard copy fallback).
- **🎉 Falling Flower Curtain**: When starting a new bouquet, a custom animation rains falling flowers down like a curtain.
- **📬 Recipient Experience**: Recipients open the encoded bouquet link, watch the postcard reveal itself with a typewriter effect, see pulsing link markers on flowers, and click them to reveal the embedded multimedia.

---

## 🛠️ Technology Stack

- **Frontend Core**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Tailored HSL color palettes, Glassmorphism, animations)
- **Routing**: Client-side single-page routing state

---

## 📂 Project Structure

```
flower shop/
├── .gitignore          # Configured Git exclude files (node_modules, dist, .env)
├── package.json        # Node project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite bundler configuration
├── public/             # Static public assets
├── fonts/              # Custom brand typography fonts (Brolimo, Typewriter, etc.)
└── src/
    ├── App.tsx         # Main App entrypoint and page router
    ├── main.tsx        # React DOM render initialization
    ├── context/
    │   └── AppContext.tsx # Global state manager (bouquet, wrap, coordinates, cards)
    ├── pages/
    │   ├── Home.tsx    # Welcome page
    │   ├── Select.tsx  # Wrap and floral choice page
    │   ├── Arrange.tsx # Drag & drop canvas page
    │   ├── Personalize.tsx # Postcard message & URL linking page
    │   ├── Share.tsx   # Share link generator & falling curtain animation
    │   └── Recipient.tsx # Receiver's interactive postcard & bouquet view
    └── styles/
        └── global.css  # CSS custom properties, variables, and typography definitions
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Harsha0906/petalink.git
   cd "flower shop"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 💻 Local Development

Run the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 📦 Production Build

Compile and bundle the project for production:
```bash
npm run build
```
The output will be generated in the `dist/` directory, ready to be deployed to static hosting providers (e.g., Netlify, Vercel, or GitHub Pages).

---

## 🔒 Security & Optimization

- Environment variables and development folders are ignored via `.gitignore`.
- Bundle assets are optimized and split during Vite production compilation to ensure minimal load times.
- Type integrity is enforced across context variables via strict TypeScript configuration.
