import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// 🚨 ESTA ES LA LÍNEA QUE FALTABA Y CAUSABA EL ERROR
const app = express();

app.use(cors());
app.use(express.json());

// Ruta base para verificar en el navegador
app.get('/', (req, res) => {
    res.send('🚀 DateAssist backend activo y reparado');
});

app.post('/chat', async (req, res) => {
    try {
        const { message, personality } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.json({ reply: 'Error: API Key no configurada en Render.' });
        }

        // Usamos la ruta v1 estable
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: `Actúa como un asistente con personalidad ${personality}. Responde breve: ${message}` }]
            }]
        });

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json({ reply: reply || 'La IA no devolvió texto.' });

    } catch (error) {
        console.error('🔥 Error en la llamada a Gemini:', error.response?.data || error.message);
        res.json({ reply: 'Error de enlace táctico. Reintentando...' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🟢 Servidor escuchando en puerto ${PORT}`);
});
