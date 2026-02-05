import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA (La que usted ve en el navegador)
app.get('/', (req, res) => res.send('🚀 DateAssist backend activo'));

app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // USAMOS v1 (Estable) para evitar el error 403 de "unregistered callers"
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: `Personalidad: ${personality}. Usuario: ${message}` }] }]
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: reply || 'Sin respuesta de IA.' });

  } catch (error) {
    console.error('🔥 Error Real:', error.response?.data || error.message);
    res.json({ reply: 'Error de enlace táctico. Reintentando...' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🟢 Jarvis escuchando en puerto ${PORT}`));
