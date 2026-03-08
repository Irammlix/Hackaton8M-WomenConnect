export default async function handler(req, res) {
    // Permitir CORS por si acaso
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    // ✅ FIX 1: Verificar que la API Key existe
    if (!API_KEY) {
        return res.status(500).json({
            candidates: [{
                content: { parts: [{ text: '⚠️ Error: La API Key de Gemini no está configurada en las variables de entorno de Vercel.' }] }
            }]
        });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
        // ✅ FIX 2: Verificar que req.body no llegue vacío
        const body = req.body;
        if (!body || !body.contents) {
            return res.status(400).json({
                candidates: [{
                    content: { parts: [{ text: '⚠️ Error: El cuerpo de la solicitud está vacío o mal formado.' }] }
                }]
            });
        }

        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        // ✅ FIX 3: Capturar si Gemini devuelve un status de error HTTP
        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            return res.status(200).json({
                candidates: [{
                    content: { parts: [{ text: `⚠️ Error HTTP ${respuesta.status} de Google: ${errorTexto}` }] }
                }]
            });
        }

        const resultado = await respuesta.json();

        if (resultado.error) {
            return res.status(200).json({
                candidates: [{
                    content: { parts: [{ text: `⚠️ Error de Google: ${resultado.error.message}` }] }
                }]
            });
        }

        res.status(200).json(resultado);

    } catch (error) {
        // ✅ FIX 4: Mostrar el error real en lugar de mensaje genérico
        res.status(500).json({
            candidates: [{
                content: { parts: [{ text: `⚠️ Error interno: ${error.message}` }] }
            }]
        });
    }
}