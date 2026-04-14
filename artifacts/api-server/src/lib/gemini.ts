import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  return model;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function generateContent(prompt: string): Promise<string> {
  const m = getModel();
  const result = await m.generateContent(prompt);
  return result.response.text();
}

export async function generateChatResponse(
  messages: ChatMessage[],
  systemInstruction?: string
): Promise<string> {
  const m = getModel();
  const chat = m.startChat({
    history: messages.slice(0, -1),
    ...(systemInstruction && {
      systemInstruction: { role: "user", parts: [{ text: systemInstruction }] },
    }),
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.parts[0].text);
  return result.response.text();
}

export async function transcribeAudio(audioBase64: string, mimeType: string): Promise<string> {
  const byteLength = Math.ceil(audioBase64.length * 3 / 4);
  if (byteLength < 1000) {
    return "";
  }

  const m = getModel();
  try {
    const result = await m.generateContent([
      { text: "Transcribe the following audio exactly. Return only the transcribed text, nothing else. If the audio is empty or silent, return an empty string." },
      {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      },
    ]);
    return result.response.text().trim();
  } catch (err: any) {
    if (err?.status === 400) {
      console.warn(`Gemini transcribe 400: audio too short or invalid (${byteLength} bytes, mime: ${mimeType})`);
      return "";
    }
    throw err;
  }
}

export async function textToSpeech(text: string): Promise<{ audioBase64: string; mimeType: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text }],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Kore",
              },
            },
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini TTS failed (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0];
  const part = candidate?.content?.parts?.[0];

  if (!part?.inlineData) {
    throw new Error("No audio data in Gemini TTS response");
  }

  return {
    audioBase64: part.inlineData.data,
    mimeType: part.inlineData.mimeType || "audio/mp3",
  };
}

export { getModel };
