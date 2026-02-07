import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🟢 Jarvis Online – OpenAI Ready");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, personality } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un asistente con personalidad ${personality}. Responde de forma breve, natural y humana.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error(
      "🔥 Error REAL:",
      error.response?.data || error.message
    );

    res.status(500).json({
      reply: "Jarvis tuvo un problema interno."
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Jarvis escuchando en", PORT);
});
