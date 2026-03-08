export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Aquí Vercel inyecta tu llave secreta automáticamente
    const API_KEY = process.env.GEMINI_API_KEY; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const resultado = await respuesta.json();
        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fallo la conexión con la IA' });
    }
}