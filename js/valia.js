// js/valia.js

// 1. Identidad del usuario
const wc_user = JSON.parse(localStorage.getItem('wc_usuario') || '{}');
if (wc_user.nombre) {
    document.getElementById('nombre-usuario').textContent = wc_user.nombre;
    document.getElementById('avatar-letra').textContent = wc_user.nombre.charAt(0).toUpperCase();
}

// 2. Función de Mensajes (Diferencia bien Izquierda de Derecha)
function agregarMensaje(texto, esUsuario) {
    const contenedor = document.getElementById('chat-mensajes');
    if(!contenedor) return;

    const div = document.createElement('div');
    
    // IMPORTANTE: 
    // esUsuario === true  -> mensaje-usuario (Derecha - Morado)
    // esUsuario === false -> mensaje-valia (Izquierda - Blanco)
    div.className = esUsuario ? 'mensaje-usuario' : 'mensaje-valia';
    div.innerHTML = `<p>${texto}</p>`;
    
    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;
}

// 3. FUNCIÓN DE BIENVENIDA (Corregida)
function iniciarValia() {
    const chat = document.getElementById('chat-mensajes');
    // Si ya hay mensajes, no saludamos de nuevo
    if (!chat || chat.children.length > 0) return;

    setTimeout(() => {
        const nombreValia = wc_user.nombre ? `, ${wc_user.nombre}` : '';
        const saludo = `Hola${nombreValia} 👋 Soy <strong>Valia</strong>, tu asistente de WomenConnect. Estoy aquí para ayudarte a verificar ofertas, revisar tu CV o apoyarte en lo que necesites. ¿En qué puedo ayudarte hoy?`;
        
        // USAMOS 'false' para que salga a la IZQUIERDA
        agregarMensaje(saludo, false);
    }, 500);
}

// Lanzar el saludo cuando cargue la página
document.addEventListener('DOMContentLoaded', iniciarValia);

// 4. Lógica de respuesta para cuando escribas (API)
function procesarRespuestaIA(mensajeUsuario) {
    // Aquí conectarás tu API real después
    setTimeout(() => {
        const respuestaIA = "Entiendo. Estoy analizando tu solicitud para darte la mejor orientación segura.";
        agregarMensaje(respuestaIA, false); // Siempre false para Valia
    }, 1500);
}

// 5. Acciones de usuario
function enviarMensaje() {
    const input = document.getElementById('chat-input');
    const mensaje = input.value.trim();
    if (!mensaje) return;

    document.getElementById('sugerencias').style.display = 'none';
    agregarMensaje(mensaje, true); // true = Derecha
    input.value = '';
    input.style.height = 'auto';
    
    procesarRespuestaIA(mensaje);
}

function mensajeRapido(texto) {
    document.getElementById('sugerencias').style.display = 'none';
    agregarMensaje(texto, true); 
    procesarRespuestaIA(texto);
}

// Utilidades de teclado
function teclaEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        enviarMensaje();
    }
}

function ajustarAltura(elemento) {
    elemento.style.height = 'auto';
    elemento.style.height = (elemento.scrollHeight) + 'px';
}

function nuevaConversacion() {
    document.getElementById('chat-mensajes').innerHTML = '';
    document.getElementById('sugerencias').style.display = 'flex';
    iniciarValia(); // Volver a saludar al limpiar
}