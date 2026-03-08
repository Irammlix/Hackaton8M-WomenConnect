export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const API_KEY = process.env.GEMINI_API_KEY; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const resultado = await respuesta.json();
        
        // Esto enviará el error real al chat si algo sale mal
        if (resultado.error) {
            return res.status(200).json({ 
                candidates: [{ 
                    content: { parts: [{ text: `⚠️ Error de Google: ${resultado.error.message}` }] } 
                }] 
            });
        }

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Fallo la conexión con la IA' });
    }
}