// js/home.js
const userData = JSON.parse(localStorage.getItem('wc_usuario') || '{}');

if (userData.nombre) {
    // Saludo principal
    const saludo = document.getElementById('saludo-nombre');
    if (saludo) saludo.textContent = userData.nombre;

    // Nombre en el sidebar
    const sidebarName = document.getElementById('nombre-usuario');
    if (sidebarName) sidebarName.textContent = userData.nombre;

    // Inicial del avatar
    const avatar = document.getElementById('avatar-letra');
    if (avatar) avatar.textContent = userData.nombre.charAt(0).toUpperCase();
}