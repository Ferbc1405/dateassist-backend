import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */
// Configuramos CORS para que su celular Motorola no sea bloqueado
app.use(cors());
app.use(express.json());

/* =========================
   RUTA DE PRUEBA
========================= */
app.get('/', (req, res) => {
  res.send('🚀 Jarvis Online - Enlace Táctico Estable');
});

/* =========================
   RUTA CHAT (Sincronizada con su App)
========================= */
app.post('/chat', async (req, res) => {
  try {
    // Captura las variables que envía su archivo ai_service.dart
    const { message, personality } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({ reply: '⚙️ Error: API Key no configurada en Render.' });
    }

    // URL corregida a v1beta para eliminar el Error 404 detectado en logs
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Estructura de datos idéntica a su prueba de CURL exitosa
    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            { 
              text: `Actúa como un asistente experto con personalidad: ${personality || 'amable'}. Responde de forma natural y breve al siguiente mensaje del usuario: "${message}"` 
            }
          ]
        }
      ]
    });

    // Extracción segura del texto de respuesta de Google Gemini
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply: reply || 'Jarvis no pudo generar una respuesta ahora.' });

  } catch (error) {
    // Imprime el error real en la consola de Render para diagnóstico
    console.error('🔥 Error Real:', error.response?.data || error.message);

    res.json({ 
      reply: 'Error de enlace táctico. Jarvis está recalibrando, intente de nuevo.' 
    });
  }
});

/* =========================
   SERVIDOR
========================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Servidor DateAssist escuchando en puerto ${PORT}`);
});
