// Configuración de VALIA con la API de Google AI Studio

const API_KEY = 'AIzaSyADBANyUyPisg1kcCNcCKnlcXwhCIPf_8c'; 

// 2. el prompt
const promptDelSistema = `Eres Valia, la asistente virtual de confianza de la plataforma "Women Connect" (escudo). Tu objetivo principal es proteger, orientar y empoderar a las mujeres en su vida laboral.
REGLA 1: Eres empática y validadora.

REGLA 2 (EL PASO PREVIO): Si la usuaria te dice "Quiero verificar una oferta de trabajo" o pide ayuda para analizar una vacante, PERO NO incluye el texto ni el enlace, responde amablemente pidiendo que te pegue la información (ej. "¡Claro que sí! Por favor, pega aquí el enlace o el texto de la oferta que quieres que analice").

REGLA 3 (LA TARJETA DE ALERTA): SOLO CUANDO la usuaria te comparta el texto de una oferta o un enlace laboral, DEBES responder ÚNICAMENTE con este bloque HTML exacto (reemplazando los corchetes con tu análisis real, sin usar markdown extra):
<div class="tarjeta-riesgo">
  <div class="tr-header">
    <span class="tr-icon">⚠️</span>
    <div>
      <h3>Riesgo [Medio/Alto/Bajo]</h3>
      <p>Requiere verificación adicional</p>
    </div>
  </div>
  <ul class="tr-lista">
    <li>[Escribe aquí la bandera roja 1 detectada]</li>
    <li>[Escribe aquí la bandera roja 2 detectada]</li>
    <li>[Escribe aquí la bandera roja 3 detectada]</li>
  </ul>
  <div class="tr-tip">💡 <span>Investiga la empresa antes de continuar. Solicita siempre contrato por escrito.</span></div>
  <div class="tr-botones">
    <button class="tr-btn" onclick="guardarOferta()">💾 Guardar</button>
    <button class="tr-btn" onclick="compartirAlerta()">📢 Compartir</button>
  </div>
</div>

REGLA 4: Para cualquier otra consulta (apoyo emocional, CV, salario), responde normalmente con texto conciso y viñetas.`;

// LÓGICA GENERAL

const usuario = JSON.parse(localStorage.getItem('wc_usuario') || '{}');
if (usuario.nombre) {
    const nombreElem = document.getElementById('nombre-usuario');
    const avatarLetra = document.getElementById('avatar-letra');
    if (nombreElem) nombreElem.textContent = usuario.nombre;
    if (avatarLetra) avatarLetra.textContent = usuario.nombre.charAt(0).toUpperCase();
}

window.onload = function() {
    console.log("Valia conectada con Gemini 🛡️");
    nuevaConversacion(); 
};

function mostrarMensaje(texto, remitente) {
    const contenedor = document.getElementById('chat-mensajes');
    if (!contenedor) return; 
    
    const div = document.createElement('div');
    div.className = `mensaje-${remitente}`; 

    let textoLimpio = texto.replace(/```html|```/g, '').trim();

    if (textoLimpio.startsWith('<div class="tarjeta-riesgo"')) {
        div.innerHTML = textoLimpio;
    } else {
        let textoFormateado = textoLimpio.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        textoFormateado = textoFormateado.replace(/\n/g, '<br>');
        div.innerHTML = `<div class="burbuja">${textoFormateado}</div>`;
    }

    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;
}

// Indicadores visuales 
function mostrarCargando() {
    const contenedor = document.getElementById('chat-mensajes');
    const div = document.createElement('div');
    div.id = 'indicador-cargando';
    div.className = 'mensaje-valia'; 
    div.innerHTML = `<div class="burbuja"><i>Valia está analizando... 🛡️</i></div>`;
    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;
}

function quitarCargando() {
    const indicador = document.getElementById('indicador-cargando');
    if (indicador) indicador.remove();
}

// Conexión con la IA 
async function consultarAValia(mensajeDeLaUsuaria, base64Data = null, mimeType = null) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const partesUsuario = [{ text: mensajeDeLaUsuaria }];
    
    if (base64Data && mimeType) {
        partesUsuario.push({
            inlineData: { mimeType: mimeType, data: base64Data }
        });
    }

    const datos = {
        system_instruction: { parts: [{ text: promptDelSistema }] },
        contents: [{ role: "user", parts: partesUsuario }],
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
    };

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();
        
        if(resultado.candidates && resultado.candidates.length > 0) {
            return resultado.candidates[0].content.parts[0].text;
        } else {
            return "Lo siento, no pude procesar eso. ¿Intentamos de nuevo?";
        }
    } catch (error) {
        return "Fallo de conexión. ¿Podemos intentarlo en un momento?";
    }
}

// para leer archivos
function manejarArchivo(input, tipo) {
    if (!input.files || input.files.length === 0) return;
    
    const archivo = input.files[0];
    const nombre = archivo.name;
    
    mostrarMensaje(`📎 Adjunté un ${tipo}: ${nombre}`, 'usuario');
    mostrarCargando();

    const lector = new FileReader();
    
    lector.onload = async function(evento) {
        // Convertimos el archivo al lenguaje Base64 que entiende la IA
        const base64Completo = evento.target.result;
        const mimeType = base64Completo.split(';')[0].split(':')[1];
        const base64Data = base64Completo.split(',')[1];

        // Instrucción oculta para Valia
        const instruccionSecreta = `Analiza detalladamente este archivo adjunto. Si es un CV, dame consejos de mejora. Si es una oferta laboral en imagen/pdf, busca banderas rojas y responde ÚNICAMENTE con la tarjeta de Riesgo en formato HTML como indican tus reglas.`;
        
        // Llamamos a la versión actualizada de Valia
        const respuestaValia = await consultarAValia(instruccionSecreta, base64Data, mimeType);
        
        quitarCargando();
        mostrarMensaje(respuestaValia, 'valia');
    };
    
    // Disparamos la lectura
    lector.readAsDataURL(archivo);
}
// === FUNCIONES===

// Función principal para enviar mensajes (activada por el botón o Enter)
async function enviarMensaje() {
    const input = document.getElementById('chat-input');
    const texto = input.value.trim();

    if (texto) {
        // 1. Mostrar tu mensaje
        mostrarMensaje(texto, 'usuario');
        input.value = '';
        input.style.height = 'auto';

        // Ocultar botones rosas de sugerencia
        const sugerencias = document.getElementById('sugerencias');
        if (sugerencias) sugerencias.style.display = 'none';

        // 2. Mostrar cargando
        mostrarCargando();

        // 3. Hablar con Google Gemini
        const respuestaValia = await consultarAValia(texto);

        // 4. Mostrar la respuesta real
        quitarCargando();
        mostrarMensaje(respuestaValia, 'valia');
    }
}

// Para la opción de "Verificar Link"
function pegarEnlace() {
    const url = prompt("Pega aquí el enlace o texto de la oferta que quieres analizar:");
    if (url) {
        const input = document.getElementById('chat-input');
        input.value = "Por favor, analiza la siguiente oferta laboral y dime si detectas banderas rojas:\n" + url; 
        enviarMensaje();   
    }
}

// Reiniciar el chat y mostrar sugerencias
function nuevaConversacion() {
    const contenedorMensajes = document.getElementById('chat-mensajes');
    if (contenedorMensajes) contenedorMensajes.innerHTML = ''; 

    const sugerencias = document.getElementById('sugerencias');
    if (sugerencias) sugerencias.style.display = 'flex';

    // Saludo de Valia basado en tu diseño
    setTimeout(() => {
        mostrarMensaje("Hola🛡️ Soy Valia, tu asistente de confianza. Puedo ayudarte a verificar ofertas laborales, revisar tu CV, orientarte en situaciones difíciles o simplemente escucharte. ¿Qué necesitas hoy?", 'valia');
    }, 500);
}   

// Clic en los botones rosas de sugerencia
function seleccionarOpcion(texto) {
    const input = document.getElementById('chat-input');
    input.value = texto;
    enviarMensaje();
}

function ajustarAltura(elemento) {
    elemento.style.height = 'auto';
    elemento.style.height = (elemento.scrollHeight) + 'px';
}

// === FUNCIONES DE ACCIÓN REALES (Usando memoria del navegador) ===

// AHORA DETECTA EL NIVEL DE RIESGO Y GENERA UN TITULO PARA SER GUARDADO EN EL PERFIL E LA USUARIA 
function guardarOferta() {
    mostrarMensaje("Quiero guardar esta oferta como evidencia.", 'usuario');
    mostrarCargando();
    
    // 1. Leemos el nivel de riesgo de la última tarjeta
    const tarjetas = document.querySelectorAll('.tarjeta-riesgo h3');
    let nivelRiesgo = "Riesgo Alto"; 
    if (tarjetas.length > 0) {
        nivelRiesgo = tarjetas[tarjetas.length - 1].innerText; 
    }
    
    // 2. ¡NUEVO! Buscamos el título oculto que Valia generó
    const puestosOcultos = document.querySelectorAll('.nombre-puesto');
    let tituloDinamico = "Oferta Evaluada por Valia"; // Título por defecto por si falla
    if (puestosOcultos.length > 0) {
        // Tomamos el último título generado y le damos el formato de tu diseño
        const nombreExtraido = puestosOcultos[puestosOcultos.length - 1].innerText;
        tituloDinamico = `Oferta: "${nombreExtraido}"`; 
    }
    
    // 3. Guardamos en la memoria
    let ofertasGuardadas = JSON.parse(localStorage.getItem('wc_ofertas_guardadas') || '[]');
    ofertasGuardadas.push({
        fecha: new Date().toLocaleDateString(),
        tipo: tituloDinamico, // Aquí inyectamos el título real que leyó la IA
        estado: nivelRiesgo 
    });
    
    localStorage.setItem('wc_ofertas_guardadas', JSON.stringify(ofertasGuardadas));

    setTimeout(() => {
        quitarCargando();
        mostrarMensaje("✅ ¡Listo, Ana! He guardado el diagnóstico detallado en tu **Espacio Seguro**.", 'valia');
    }, 1000);
}

//enviar a la usuaria a comunidad con un mensaje pre-armado para que lo publique y alerte a otras mujeres (usando memoria del navegador para pasar el mensaje)
function compartirAlerta() {
    mostrarMensaje("Quiero generar una alerta en la Comunidad.", 'usuario');
    mostrarCargando();
    
    // demo: Este es el borrador pre-armado de post
    const borrador = "¡Hola compañeras! Acabo de analizar una oferta con Valia y detectamos bandera rojas (ej. piden dinero por adelantado/falta información). Tengan mucho cuidado con esta vacante. #AlertaLaboral";
    
    // guardar en la memoria temporal del navegador
    localStorage.setItem('wc_borrador_alerta', borrador);

    setTimeout(() => {
        quitarCargando();
        mostrarMensaje("📢 ¡Excelente decisión! He preparado un borrador. Te estoy redirigiendo a la **Comunidad** para que lo revises y lo publiques cuando estés lista...", 'valia');
        
        // Redirigir a la página de comunidad
        setTimeout(() => {
            window.location.href = 'community.html';
        }, 2000);
        
    }, 1200);
}

// funcion de voz
function iniciarDictado() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tu navegador no soporta el dictado por voz. Te sugiero usar Google Chrome o Edge.");
        return;
    }

    const reconocimiento = new SpeechRecognition();
    reconocimiento.lang = 'es-PE';
    reconocimiento.interimResults = false;

    reconocimiento.onstart = function() {
        console.log("Micrófono encendido y escuchando...");
        mostrarMensaje("*Escuchando... Habla ahora*", 'usuario');
    };

    reconocimiento.onresult = (evento) => {
        const textoHablado = evento.results[0][0].transcript;
        console.log("🗣️ Escuché esto:", textoHablado);
        document.getElementById('chat-input').value = textoHablado;
        enviarMensaje(); 
    };

    reconocimiento.onerror = (evento) => {
        console.error("❌ Error del micrófono:", evento.error);
        
        if (evento.error === 'not-allowed') {
            alert("¡El navegador bloqueó el micrófono! Revisa el ícono de la camarita en la barra de direcciones de arriba.");
        } else {
            mostrarMensaje(`Uy, algo falló con el audio (Error: ${evento.error}). ¿Intentamos de nuevo?`, 'valia');
        }
    };

    reconocimiento.start();
}