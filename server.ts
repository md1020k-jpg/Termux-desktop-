import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Gemini AI if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API endpoint for Gemini Termux AI Copilot
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check your secrets.'
        });
      }

      const systemInstruction = `You are Termux Desktop AI Copilot, an expert Linux-on-Android and Termux specialist. You help users configure Termux-X11, VNC, PRoot distros (Ubuntu, Debian, Arch), hardware acceleration (Adreno Turnip/Zink, Mali Panfrost), and window managers (XFCE4, LXQt, i3wm, Openbox). Provide accurate bash commands, troubleshooting steps, and clear explanations.`;

      const fullPrompt = `${systemInstruction}\n\nContext:\n${context || 'General Termux Desktop query'}\n\nUser Question:\n${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI response' });
    }
  });

  // Setup Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
