app.post('/chat', async (req, res) => {
  try {
    const { message, personality } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Cambiamos a la URL 'v1' (más estable que v1beta)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: `Personalidad: ${personality}. Usuario: ${message}` }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Si la IA responde, enviamos el texto. Si no, avisamos.
    res.json({ reply: reply || "Jarvis está procesando, intente de nuevo." });

  } catch (error) {
    // Esto nos dirá el error real en los logs de Render
    console.error('🔥 Error Crítico:', error.response?.data || error.message);
    res.json({ reply: "Error de enlace táctico. Reintentando..." });
  }
});
