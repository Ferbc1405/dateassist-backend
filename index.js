import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('🚀 Jarvis Online - Enlace Estable v2'));

app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // ESTA ES LA URL EXACTA QUE ELIMINA EL ERROR 404
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Actúa como un asistente con personalidad ${personality}. Responde de forma breve y natural al siguiente mensaje del usuario: ${message}` }]
      }]
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: reply || 'La IA está procesando, intente de nuevo.' });

  } catch (error) {
    // Esto imprimirá el error real en Render para que lo veamos juntos
    console.error('🔥 Error Detallado:', error.response?.data || error.message);
    res.json({ reply: 'Error de enlace táctico. Reintentando...' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🟢 Servidor escuchando en puerto ${PORT}`));
