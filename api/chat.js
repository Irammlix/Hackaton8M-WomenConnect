export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({
            candidates: [{ content: { parts: [{ text: '⚠️ Error: La API Key de Anthropic no está configurada en Vercel.' }] } }]
        });
    }

    try {
        const { system_instruction, contents } = req.body;

        // Convertir formato Gemini → formato Claude
        const systemPrompt = system_instruction?.parts?.[0]?.text || '';
        const mensajes = contents.map(c => ({
            role: c.role === 'user' ? 'user' : 'assistant',
            content: c.parts.map(p => {
                if (p.text) return { type: 'text', text: p.text };
                if (p.inlineData) return {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: p.inlineData.mimeType,
                        data: p.inlineData.data
                    }
                };
            }).filter(Boolean)
        }));

        const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001', // rápido y económico, perfecto para chatbot
                max_tokens: 1024,
                system: systemPrompt,
                messages: mensajes
            })
        });

        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            return res.status(200).json({
                candidates: [{ content: { parts: [{ text: `⚠️ Error ${respuesta.status}: ${errorTexto}` }] } }]
            });
        }

        const resultado = await respuesta.json();
        const textoRespuesta = resultado.content?.[0]?.text || 'No hubo respuesta.';

        // Devolver en el mismo formato Gemini para que chatbot.js no necesite cambios
        res.status(200).json({
            candidates: [{
                content: { parts: [{ text: textoRespuesta }] }
            }]
        });

    } catch (error) {
        res.status(500).json({
            candidates: [{ content: { parts: [{ text: `⚠️ Error interno: ${error.message}` }] } }]
        });
    }
}