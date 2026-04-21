# AetherChat AI - Modern Chatbot

A premium, modern AI chatbot built with React, styled with vanilla CSS, and powered by Hugging Face Inference APIs.

## Features
- **Clean Chat UI**: Responsive design with message bubbles and glassmorphism.
- **LLM Integration**: Uses `mistralai/Mistral-7B-Instruct-v0.2` for intelligent conversations.
- **Image Generation**: Uses `stabilityai/stable-diffusion-xl-base-1.0` to generate images directly in chat.
- **UX Polish**: Typing indicators, auto-scroll, and button disabling during requests.

## Getting Started

### 1. Set your Hugging Face Token
1. Create a `.env` file in the root directory (I have already created a template for you).
2. Add your token to the `.env` file:
   ```env
   VITE_HF_TOKEN=your_actual_token_here
   ```
3. If you are using the standalone `chatbot.html` version, you still need to manually edit the `HF_TOKEN` variable inside that file, as standalone HTML files cannot read `.env` files directly.

### 2. Run the App
You have two ways to run this:

#### Option A: Vite Dev Server (Recommended)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the URL shown in your terminal.

#### Option B: Standalone HTML
Simply open `chatbot.html` directly in any web browser. No installation or server required!

## Project Structure
- `src/App.jsx`: Main React component logic and API calls.
- `src/index.css`: Modern design system and styles.
- `chatbot.html`: Single-file standalone version of the app.
