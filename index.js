import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   RUTA DE PRUEBA
========================= */
app.get('/', (req, res) => {
  res.send('🚀 DateAssist backend activo');
});

/* =========================
   RUTA CHAT (CITAS / PAREJA)
========================= */
app.post('/chat', async (req, res) => {
  try {
    console.log('📩 Body recibido:', req.body);

    const { message, mode } = req.body;

    /* ---------- VALIDACIONES ---------- */
    if (!message || message.trim() === '') {
      return res.status(200).json({
        reply: 'No recibí ningún mensaje.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: 'La API Key no está configurada.'
      });
    }

    /* ---------- PROMPTS POR MODO ---------- */
    const prompts = {
      citas: `
Eres un asistente experto en citas románticas.
Ayudas a coquetear con respeto, generar atracción,
mantener conversaciones interesantes y dar consejos
prácticos y breves. Tono seguro, natural y carismático.
      `,
      pareja: `
Eres un asistente experto en relaciones de pareja.
Ayudas a mejorar la comunicación, resolver conflictos,
fortalecer el vínculo emocional y actuar con empatía.
Tono maduro, cercano y comprensivo.
      `,
      default: `
Eres un asistente amable, empático y claro.
Responde de forma breve y natural.
      `
    };

    const systemPrompt = prompts[mode] || prompts.default;

    const finalPrompt = `
${systemPrompt}

Mensaje del usuario:
"${message}"
    `.trim();

    /* ---------- LLAMADA A GEMINI ---------- */
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: finalPrompt }]
        }
      ]
    });

    console.log('🤖 Respuesta Gemini:', JSON.stringify(response.data, null, 2));

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(200).json({
        reply: 'No pude generar una respuesta en este momento.'
      });
    }

    /* ---------- RESPUESTA FINAL ---------- */
    res.status(200).json({ reply });

  } catch (error) {
    console.error('🔥 Error real:', error.response?.data || error.message);

    // Nunca devolver 500 a la app
    res.status(200).json({
      reply: 'Estoy teniendo un pequeño inconveniente, intenta de nuevo.'
    });
  }
});

/* =========================
   SERVIDOR
========================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 DateAssist backend escuchando en puerto ${PORT}`);
});
