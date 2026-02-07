import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("🟢 Jarvis Online – OpenAI SDK");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, personality } = req.body;

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: `Eres un asistente con personalidad ${personality}. Responde de forma breve y natural:\n\n${message}`
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("🔥 Error REAL:", error);
    res.status(500).json({
      reply: "Error interno de Jarvis."
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Jarvis escuchando en", PORT);
});