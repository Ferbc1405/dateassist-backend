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

    // RUTA MANUAL: Evita que la librería use 'v1beta' si no es compatible
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Actúa como ${personality}. Responde de forma muy breve: ${message}` }]
      }]
    });

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });

  } catch (error) {
    // Esto nos dirá en Render si la Key está mal o si hay otro bloqueo
    console.error("Error Detallado:", error.response?.data || error.message);
    res.status(500).json({ reply: "Error de enlace táctico." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Conexión directa establecida`));