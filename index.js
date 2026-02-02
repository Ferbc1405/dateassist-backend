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
      throw new Error("API Key no configurada en Render");
    }

    // Petición directa vía Axios para evitar el error 500 de compatibilidad
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: `Actúa como ${personality}. Responde breve: ${message}` }] }]
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (error) {
    console.error("Error Interno:", error.response?.data || error.message);
    res.status(500).json({ 
      reply: "Error de enlace táctico.",
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Jarvis operativo en puerto ${PORT}`));