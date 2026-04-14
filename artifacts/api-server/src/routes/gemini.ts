import { Router, type IRouter } from "express";
import { generateContent, generateChatResponse, transcribeAudio, textToSpeech, type ChatMessage } from "../lib/gemini.js";

const router: IRouter = Router();

router.post("/gemini/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "prompt is required and must be a string" });
      return;
    }
    const text = await generateContent(prompt);
    res.json({ text });
  } catch (err: any) {
    console.error("Gemini generate error:", err);
    res.status(500).json({ error: err.message || "Failed to generate content" });
  }
});

router.post("/gemini/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, withTts } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required and must not be empty" });
      return;
    }
    const text = await generateChatResponse(messages as ChatMessage[], systemInstruction);

    if (withTts && text) {
      try {
        const ttsText = text.replace(/<<FILTER_DEPT:[^>]+>>|<<FILTER_EMP:[^>]+>>/g, '').trim();
        const { audioBase64, mimeType } = await textToSpeech(ttsText);
        res.json({ text, audio: audioBase64, audioMimeType: mimeType });
        return;
      } catch (ttsErr: any) {
        console.error("TTS in chat failed (returning text only):", ttsErr.message);
      }
    }

    res.json({ text });
  } catch (err: any) {
    console.error("Gemini chat error:", err);
    res.status(500).json({ error: err.message || "Failed to generate chat response" });
  }
});

router.post("/gemini/transcribe", async (req, res) => {
  try {
    const { audio, mimeType } = req.body;
    if (!audio || typeof audio !== "string") {
      res.status(400).json({ error: "audio base64 string is required" });
      return;
    }
    const text = await transcribeAudio(audio, mimeType || "audio/webm");
    res.json({ text });
  } catch (err: any) {
    console.error("Gemini transcribe error:", err);
    res.status(500).json({ error: err.message || "Failed to transcribe audio" });
  }
});

router.post("/gemini/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "text string is required" });
      return;
    }
    const { audioBase64, mimeType } = await textToSpeech(text);
    res.json({ audio: audioBase64, mimeType });
  } catch (err: any) {
    console.error("Gemini TTS error:", err);
    res.status(500).json({ error: err.message || "Failed to generate speech" });
  }
});

router.get("/gemini/info", (_req, res) => {
  res.json({
    model: "gemini-2.0-flash",
    projectId: process.env.GOOGLE_PROJECT_ID || "not set",
    location: process.env.GOOGLE_LOCATION || "not set",
    status: process.env.GEMINI_API_KEY ? "configured" : "missing API key",
  });
});

export default router;
