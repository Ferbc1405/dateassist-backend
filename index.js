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

// 🧠 MODOS DE JARVIS
const MODOS = {
  BLOQUEADO: {
    system: `Eres Jarvis en modo bloqueado.
Responde de forma muy breve, educada y neutral.
No coquetees, no muestres emociones, no hagas preguntas personales.
Mantén distancia y profesionalismo absoluto.`,
  },

  NORMAL: {
    system: `Eres Jarvis, un asistente cercano y empático.
Hablas de forma natural, amable y humana.
No coquetees, pero sé cálido y atento.`,
  },

  ENCANTO: {
    system: `Eres Jarvis en modo encanto.
Tienes carisma, seguridad y encanto natural.
Usas indirectas sutiles, cumplidos elegantes y coqueteo inteligente.
No seas explícito ni vulgar.
Haz sentir especial a la otra persona con respuestas breves y magnéticas.`,
  },
};

// 🏠 Health check
app.get("/", (req, res) => {
  res.send("🚀 Jarvis Online – OpenAI Ready");
});

// 💬 CHAT PRINCIPAL
app.post("/chat", async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.json({ reply: "No recibí ningún mensaje." });
    }

    // 🔒 Bloqueo total (opcional)
    if (mode === "BLOQUEADO") {
      return res.json({
        reply: "Estoy en modo silencio por ahora.",
      });
    }

    const modoSeleccionado = MODOS[mode] || MODOS.NORMAL;

    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content: modoSeleccionado.system,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      response.output_text ||
      "Estoy pensando…";

    res.json({ reply });

  } catch (error) {
    console.error("🔥 Error OpenAI:", error.message);
    res.status(500).json({
      reply: "Error de enlace táctico. Reintentando...",
    });
  }
});

// 🌐 Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 Jarvis escuchando en puerto ${PORT}`);
});
