import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: "API Key no configurada." });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: `Actúa como ${personality}. Responde de forma breve y clara: ${message}`
            }
          ]
        }
      ]
    });

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "No se obtuvo respuesta.";

    res.json({ reply });

  } catch (error) {
    console.error("❌ Error Gemini:", error.response?.data || error.message);
    res.status(500).json({ reply: "Error temporal del asistente." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DateAssist backend activo`);
});
