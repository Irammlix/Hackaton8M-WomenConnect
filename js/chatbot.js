// Configuración de VALIA con la API de Google AI Studio

const API_KEY = 'AIzaSyBHpxNevadV9Q_hX-4PJfwZe5DOck3K6mY'; 

// 2. el prompt
// 2. el prompt
const promptDelSistema = `Eres Valia, la asistente virtual de confianza de la plataforma "Women Connect" (escudo). Tu objetivo principal es proteger, orientar y empoderar a las mujeres en su vida laboral.
REGLA 1: Eres empática y validadora.

REGLA 2: Si la usuaria te dice "Quiero verificar una oferta de trabajo" pero no incluye el texto/enlace, pide amablemente que lo pegue.

REGLA 3: SOLO CUANDO la usuaria comparta una oferta, DEBES responder ÚNICAMENTE con este bloque HTML exacto (reemplaza los corchetes con tu análisis real, sin usar markdown extra):
<div class="tarjeta-riesgo">
  <div class="tr-header">
    <span class="tr-icon">⚠️</span>
    <div>
      <h3 class="nivel-riesgo">Riesgo [Alto/Medio/Bajo]</h3>
      <p class="nombre-puesto">Oferta: "[Título del Puesto]"</p>
    </div>
  </div>
  <p class="tr-desc">[Escribe aquí una breve descripción de 2 líneas sobre por qué tiene este nivel de riesgo]</p>
  <ul class="tr-lista">
    <li>[Bandera roja 1 o punto a favor]</li>
    <li>[Bandera roja 2 o punto a favor]</li>
    <li>[Bandera roja 3 o punto a favor]</li>
  </ul>
  <div class="tr-tip">💡 <span>Investiga la empresa antes de continuar. Solicita siempre contrato por escrito.</span></div>
  <div class="tr-botones">
    <button class="tr-btn" onclick="guardarOferta()">💾 Guardar</button>
    <button class="tr-btn" onclick="compartirAlerta()">📢 Compartir</button>
  </div>
</div>

REGLA 4: Para cualquier otra consulta, responde normalmente con texto conciso.`;
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
        // Convertimos el archivo al lenguaje Base64
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
    
    // 1. Buscamos la última tarjeta renderizada en el chat
    const tarjetas = document.querySelectorAll('.tarjeta-riesgo');
    if (tarjetas.length === 0) {
        quitarCargando();
        return;
    }
    const ultimaTarjeta = tarjetas[tarjetas.length - 1];
    
    // 2. Extraemos los datos generados por Valia
    const nivelRiesgo = ultimaTarjeta.querySelector('.nivel-riesgo') ? ultimaTarjeta.querySelector('.nivel-riesgo').innerText : "Riesgo Alto";
    const tituloPuesto = ultimaTarjeta.querySelector('.nombre-puesto') ? ultimaTarjeta.querySelector('.nombre-puesto').innerText : "Oferta sin título";
    const descripcion = ultimaTarjeta.querySelector('.tr-desc') ? ultimaTarjeta.querySelector('.tr-desc').innerText : "Análisis guardado por la usuaria.";
    
    // Extraemos las viñetas como "etiquetas" (signals)
    const listaItems = ultimaTarjeta.querySelectorAll('.tr-lista li');
    const etiquetas = Array.from(listaItems).map(li => li.innerText);
    
    // 3. Formateamos la fecha actual (ej. "14 feb 2024")
    const opcionesFecha = { day: 'numeric', month: 'short', year: 'numeric' };
    const fechaActual = new Date().toLocaleDateString('es-ES', opcionesFecha);
    
    // 4. Guardamos en la memoria (agregamos al inicio para que salga primero)
    let ofertasGuardadas = JSON.parse(localStorage.getItem('wc_ofertas_guardadas') || '[]');
    ofertasGuardadas.unshift({
        id: Date.now(), // Identificador único
        titulo: tituloPuesto,
        estado: nivelRiesgo,
        descripcion: descripcion,
        etiquetas: etiquetas,
        fecha: fechaActual
    });
    
    localStorage.setItem('wc_ofertas_guardadas', JSON.stringify(ofertasGuardadas));

    setTimeout(() => {
        quitarCargando();
        mostrarMensaje("✅ ¡Listo! He guardado el diagnóstico detallado en tu **Espacio Seguro**.", 'valia');
    }, 1000);
}
//enviar a la usuaria a comunidad con un mensaje pre-armado para que lo publique y alerte a otras mujeres (usando memoria del navegador para pasar el mensaje)
// Función para compartir en la Comunidad
function compartirAlerta() {
    mostrarMensaje("Quiero generar una alerta en la Comunidad.", 'usuario');
    mostrarCargando();
    
    // 1. Buscamos la última tarjeta de Valia
    const tarjetas = document.querySelectorAll('.tarjeta-riesgo');
    if (tarjetas.length === 0) {
        quitarCargando();
        return;
    }
    const ultimaTarjeta = tarjetas[tarjetas.length - 1];
    
    // 2. Extraemos los datos del análisis
    const nivelRiesgoTexto = ultimaTarjeta.querySelector('.nivel-riesgo') ? ultimaTarjeta.querySelector('.nivel-riesgo').innerText.toLowerCase() : "alto";
    const tituloPuesto = ultimaTarjeta.querySelector('.nombre-puesto') ? ultimaTarjeta.querySelector('.nombre-puesto').innerText : "Oferta sin título";
    const descripcion = ultimaTarjeta.querySelector('.tr-desc') ? ultimaTarjeta.querySelector('.tr-desc').innerText : "Revisen esto chicas.";
    
    // 3. Armamos el borrador inteligente según el riesgo
    let borrador = "";
    let etiquetaSugerida = "";

    if (nivelRiesgoTexto.includes('alto')) {
        borrador = `⚠️ ¡Chicas, alerta de posible estafa! Analicé esta oferta con la IA y detectó banderas rojas importantes. Tengan mucho cuidado.\n\n📌 ${tituloPuesto}\n📝 ${descripcion}`;
        etiquetaSugerida = "#OfertaFalsa"; 
    } else if (nivelRiesgoTexto.includes('medio')) {
        borrador = `⚡ Chicas, tengan cuidado con esta oferta. Tiene algunos puntos dudosos que Valia me ayudó a detectar. Mejor pregunten bien antes de firmar.\n\n📌 ${tituloPuesto}\n📝 ${descripcion}`;
        etiquetaSugerida = "#Consejos";
    } else {
        borrador = `✅ ¡Hola chicas! Encontré esta oferta y según el análisis del Escudo se ve bastante segura. Se las comparto por si alguna está buscando en esta área:\n\n📌 ${tituloPuesto}\n📝 ${descripcion}`;
        etiquetaSugerida = "#ReinicioLaboral";
    }
    
    // 4. Guardamos todo en la memoria temporal
    const datosBorrador = { texto: borrador, etiqueta: etiquetaSugerida };
    localStorage.setItem('wc_alerta_pendiente', JSON.stringify(datosBorrador));

    // 5. Redirigimos
    setTimeout(() => {
        quitarCargando();
        mostrarMensaje("📢 ¡Excelente decisión! He preparado tu borrador. Te estoy redirigiendo a la **Comunidad** para que lo revises y le añadas la foto si deseas...", 'valia');
        
        setTimeout(() => {
            window.location.href = 'community.html';
        }, 2200);
        
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