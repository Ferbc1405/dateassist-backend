import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) =>
  res.send('🚀 Jarvis Online – Gemini SDK OK')
);

app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash'
    });

    const result = await model.generateContent(
      `Actúa como un asistente con personalidad ${personality}. 
       Responde de forma breve y natural:\n\n${message}`
    );

    res.json({
      reply: result.response.text()
    });

  } catch (error) {
    console.error('🔥 Error Detallado:', error);
    res.status(500).json({
      reply: 'Error de enlace táctico. Reintentando...'
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🟢 Servidor escuchando en puerto ${PORT}`)
);