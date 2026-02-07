import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 OpenAI Client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 MODOS DE DATEASSIST (JARVIS)
// Reestructurados para brevedad absoluta
const MODOS = {
  BLOQUEADO: {
    system: "Eres Jarvis. Modo: Bloqueo de Chat. Tu objetivo es dar una respuesta corta (máximo 12 palabras) para salir del paso. Sé neutral, directo y no hagas preguntas. No uses emojis.",
  },

  NORMAL: {
    system: "Eres Jarvis. Modo: Chat Normal. Responde de forma humana, directa y breve. Máximo 15 palabras. Evita introducciones innecesarias.",
  },

  ENCANTO: {
    system: "Eres Jarvis. Modo: Encanto. Genera una respuesta magnética, breve y con chispa. Máximo 12 palabras. Usa el ingenio, no el romance genérico. Directo al grano.",
  },
};

// 🏠 Health check
app.get("/", (req, res) => {
  res.send("🚀 DateAssist Engine Online");
});

// 💬 CHAT PRINCIPAL
app.post("/chat", async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Mensaje vacío." });
    }

    const modoSeleccionado = MODOS[mode] || MODOS.NORMAL;

    // Nota: He actualizado a 'chat.completions.create' que es el estándar de OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // O el modelo que prefieras usar
      messages: [
        { role: "system", content: modoSeleccionado.system },
        { role: "user", content: message },
      ],
      max_tokens: 40, // Forzamos brevedad desde el hardware
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content.trim();

    res.json({ reply });

  } catch (error) {
    console.error("🔥 Error:", error.message);
    res.status(500).json({
      reply: "Error de enlace. Intenta de nuevo.",
    });
  }
});

// 🌐 Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 DateAssist escuchando en puerto ${PORT}`);
});
