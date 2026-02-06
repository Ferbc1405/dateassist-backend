import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('🚀 Jarvis Online - Núcleo Estabilizado'));

app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // CAMBIO TÁCTICO FINAL: 
    // Usamos la ruta estable /v1/ y el modelo exacto 'gemini-1.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Eres un asistente experto con personalidad ${personality}. Usuario: ${message}` }]
      }]
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: reply || 'IA sin respuesta.' });

  } catch (error) {
    // Si vuelve a dar 404, el log nos dirá EXACTAMENTE por qué
    console.error('🔥 Error Detallado:', JSON.stringify(error.response?.data || error.message, null, 2));
    res.json({ reply: 'Error de enlace táctico. Reintentando...' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🟢 Servidor en puerto ${PORT}`));
