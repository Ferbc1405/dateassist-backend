import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= OPENAI =================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🔑 API KEY:", process.env.OPENAI_API_KEY ? "CARGADA" : "NO CARGADA");

// ================= HEALTH CHECK =================
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

// ================= MODO CITA =================
app.post("/chat", async (req, res) => {
  try {
    const { personality, message } = req.body;

    if (!message || !personality) {
      return res.status(400).json({
        reply: "Faltan datos para generar la respuesta.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente experto en citas. Respondes de forma natural, segura y atractiva.",
        },
        {
          role: "user",
          content: `Personalidad: ${personality}\nSituación: ${message}`,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("❌ ERROR MODO CITA:", error);
    res.status(500).json({
      reply: "Error al generar la respuesta. Intenta de nuevo.",
    });
  }
});

// ================= MODO PAREJA =================
app.post("/couple", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        reply: "No recibí el mensaje.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente empático experto en relaciones de pareja. Respondes con calma, comprensión y sin juzgar.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("❌ ERROR MODO PAREJA:", error);
    res.status(500).json({
      reply: "Hubo un problema al generar la respuesta.",
    });
  }
});

// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend corriendo en http://0.0.0.0:${PORT}`);
});
