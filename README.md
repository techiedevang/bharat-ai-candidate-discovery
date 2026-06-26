# Bharat AI Sourcing Hub & Evaluation Pipeline

An offline-capable, intelligent full-stack candidate discovery engine and certified evaluation pipeline designed to bridge the regional linguistic and technical qualifications gap in decentralized sourcing grids across India.

This workspace features an interactive dashboard that translates localized and vernacular resumes, computes dynamic Cognitive Fit Matching Scores, maintains a decentralized recruiters' gamification leaderboard, and integrates directly with a secure Python process runner to certify `submission.csv` outputs against the official `validate_submission.py` suite.

---

## 🎨 Interactive Slide Deck
We have integrated a full-featured, styled **Interactive Approach Slide Deck** directly in the UI! You can view it by clicking the **"Approach Slides (PPT)"** button in the dashboard or export/download it as a real, beautifully-designed PowerPoint presentation file (`.pptx`) utilizing custom visual palettes.

---

## 🛠️ Tech Stack

### 1. Frontend (Client-Side)
- **Framework**: React 19 & TypeScript (strict types, highly modular)
- **Styling**: Tailwind CSS (with clean, elegant modern Slate, Indigo, and Teal accents)
- **Build Tool**: Vite 6 (optimizing assets and delivering extreme-workload responsiveness)
- **Animations**: `motion` (by framer) for high-fidelity micro-interactions and staggered list entries
- **Icons**: `lucide-react` (uniform SVG icon library)
- **PPTX Generation Engine**: `pptxgenjs` (enables real-time, custom-themed PowerPoint slideshow generation directly in-browser)

### 2. Backend (Server-Side)
- **Runtime**: Node.js with Native TypeScript Support via `tsx`
- **Server**: Express (robust API routes, streamable sub-process runner, and server-side states)
- **Bundler**: `esbuild` for compiling TypeScript server entry points into single, hyper-optimized CommonJS modules (`dist/server.cjs`)
- **Intelligence Model Integration**: `@google/genai` (The modern Google Gen AI SDK) for multilingual/dialect text standardizations and cognitive skills parsing

### 3. Evaluation & Validation Layer
- **Language**: Python 3
- **Validation Suite**: `validate_submission.py` (Official Python check suite verifying data structures and column compliance of generated files)

---

## 🚀 Key Features & How They Work

### 1. Cognitive Fit Matching Engine
- Translates localized inputs, vernacular English dialects, and certifications from Tier-2/3 regional hubs.
- Maps varying credentials into standardized professional skill vectors.
- Dynamically scores candidates based on weighted ratings for technical skill fitness, target region location availability, language fluencies, and experience brackets.

### 2. Interactive Python Validator Execution
- Rather than simulating the validation logic in JavaScript, the Express backend spawns a secure sub-process to run the actual official Python script (`validate_submission.py`).
- Logs and terminal diagnostics are streamed directly back to the recruiter dashboard in real-time, allowing instant troubleshooting.

### 3. Gamified Regional Sourcing & Leaderboard
- Motivates sourcing agents using a gamified node leader board, score points, active contributions tracing, and automatic digital achievement badges.
- Keeps candidate information auditable and verified via collaborative reviews.

---

## 💻 How to Run on Your Local Machine

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Python 3** (required for the submission validation suite)

### 1. Extract & Navigate
Navigate to the root directory of the project in your terminal:
```bash
cd bharat-ai-sourcing-hub
```

### 2. Environment Variables Configuration
Create a `.env` file at the root of the project (you can copy the structure from `.env.example`):
```bash
cp .env.example .env
```
Fill in the variable values inside `.env`:
```env
# Google Gemini API Key (Required for server-side linguistic translations)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Dependencies
Install all package dependencies declared in `package.json`:
```bash
npm install
```

### 4. Run Development Server
Boot up both the Express backend and Vite frontend concurrently via our single dev command:
```bash
npm run dev
```
The application will launch on your local machine.

### 5. Accessing the App (What to Write in the App URL)
When running locally, the unified development server runs behind port `3000`. Open your browser and navigate to:
```
http://localhost:3000
```
*Note: Do not try to access port 5173 or other ports, as all assets, hot module loads, and API routes are proxied cleanly through Express on port `3000`.*

---

## 📦 Production Build & Start

To build and run the application in a production-ready environment (simulating how it runs inside a Docker/Cloud Run container):

### 1. Build Client and Bundle Server
This compiles the React static files and bundles the Express server into `dist/server.cjs` using `esbuild`:
```bash
npm run build
```

### 2. Run Production Server
Launches the self-contained production bundle:
```bash
npm run start
```
Go to `http://localhost:3000` to interact with the high-performance production build.
