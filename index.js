import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configuración exclusiva de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Actúa como ${personality || 'asistente'}. Responde de forma breve y útil: ${message}`;
    const result = await model.generateContent(prompt);
    
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error en el núcleo:", error);
    res.status(500).json({ reply: "Error en la matriz de IA." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor listo en puerto ${PORT}`));