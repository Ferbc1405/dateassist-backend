import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Se inicializa con la variable que ya configuramos en Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    // Usamos el modelo sin prefijos de versión para que la librería elija la mejor ruta estable
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Actúa como Jarvis. Personalidad: ${personality}. Mensaje: ${message}`;
    const result = await model.generateContent(prompt);
    
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Fallo en la matriz:", error);
    res.status(500).json({ reply: "Error de enlace neuronal." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Jarvis activo en puerto ${PORT}`));