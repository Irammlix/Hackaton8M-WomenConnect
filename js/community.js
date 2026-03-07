// js/community.js

// 1. Cargar datos del usuario
const user = JSON.parse(localStorage.getItem('wc_usuario') || '{}');
if (user.nombre) {
    document.getElementById('nombre-usuario').textContent = user.nombre;
    document.getElementById('avatar-letra').textContent = user.nombre.charAt(0).toUpperCase();
}

// 2. Lógica de etiquetas
function seleccionarEtiqueta(el) {
    document.querySelectorAll('.tag-selector .btn-tag').forEach(b => {
        b.style.background = 'white';
        b.style.color = 'var(--rosa-fuerte)';
    });
    el.style.background = 'var(--rosa-fuerte)';
    el.style.color = 'white';
}

// 3. Simulación de publicación
function publicarPost() {
    const texto = document.getElementById('texto-post').value;
    if(!texto) return;
    
    // Aquí iría la lógica de guardado
    mostrarToast("¡Experiencia compartida con éxito!");
    cerrarModal('modal-publicar');
    document.getElementById('texto-post').value = '';
}