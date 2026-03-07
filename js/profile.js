// js/profile.js — Lógica para la gestión de Mi Espacio

// 1. Cargar Identidad del Usuario desde LocalStorage
const datosUsuario = JSON.parse(localStorage.getItem('wc_usuario') || '{}');

function cargarPerfil() {
    const nombreUI = document.getElementById('nombre-usuario');
    const avatarUI = document.getElementById('avatar-letra');

    if (datosUsuario.nombre) {
        // Actualizar Sidebar
        nombreUI.textContent = datosUsuario.nombre;
        avatarUI.textContent = datosUsuario.nombre.charAt(0).toUpperCase();
    }
}

// 2. Simulación de Interacción para los Ítems
// Esto permite que el jurado vea que la interfaz responde al clic
document.querySelectorAll('.mini-item').forEach(item => {
    item.addEventListener('click', function() {
        const titulo = this.querySelector('.mini-titulo').textContent;
        mostrarToast(`Abriendo: ${titulo}...`);
    });
});

// 3. Inicializar al cargar el documento
document.addEventListener('DOMContentLoaded', cargarPerfil);

// 4. Función para cerrar sesión (Limpieza de datos si es necesario)
function cerrarSesion() {
    // Para el hackatón, simplemente redirigimos al login
    window.location.href = 'index.html';
}