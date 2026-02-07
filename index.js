import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🚀 Jarvis Online – OpenAI Connected");
});

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message, personality } = req.body;

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: `Actúa como un asistente con personalidad ${personality}. Responde de forma natural y breve.\n\nUsuario: ${message}`,
    });

    res.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("🔥 Error OpenAI:", error.message);

    res.status(500).json({
      reply: "Error de enlace táctico. Reintentando...",
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor activo en http://localhost:${PORT}`);
});