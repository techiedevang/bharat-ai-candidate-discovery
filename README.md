# BHARAT AI - Candidate Discovery Co-Pilot

A powerful, AI-driven candidate discovery and matching platform designed to empower recruiters with intelligent linguistic translation, deep semantic candidate scoring, and a gamified verification ledger. 

## Features

- **Regional Linguistic Translation:** Search for candidates using regional queries. Gemini AI translates and extracts technical keywords automatically.
- **Deep Cognitive Fit Ranking:** Matches job descriptions against candidate profiles using advanced LLM reasoning, considering behavioral signals (loyalty, response rate) and technical skills.
- **Decentralized Crowdsourced Ledger:** Gamified system where recruiters earn points and digital badges for sourcing, verifying profiles, and correcting data.
- **Offline Hackathon Ranker:** Bulk candidate processing and ranking pipeline, capable of parsing large datasets and exporting compliant submission CSVs.

## Setup & Running Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Create a `.env` file from the example and add your Gemini API Key.
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to include your actual `GEMINI_API_KEY`.

3. Run the application:
   ```bash
   npm run dev
   ```
   *Note: This will start a custom Express backend which handles both the API and the Vite frontend. The application will be available at **http://localhost:3000**.*

## Tech Stack

- **Frontend:** React, TailwindCSS, Vite
- **Backend:** Express, Node.js (via `server.ts`)
- **AI Integration:** Google Gemini AI API (`@google/genai`)
