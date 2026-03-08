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
        
        // AGREGA ESTA LÍNEA PARA VER EL ERROR REAL EN VERCEL
        console.log("Respuesta de Gemini:", JSON.stringify(resultado, null, 2));

        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error en la función:", error);
        res.status(500).json({ error: 'Fallo la conexión con la IA' });
    }
}