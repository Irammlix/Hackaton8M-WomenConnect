// js/ranking.js

// 1. Identidad
const user_ranking = JSON.parse(localStorage.getItem('wc_usuario') || '{}');
if (user_ranking.nombre) {
    document.getElementById('nombre-usuario').textContent = user_ranking.nombre;
    document.getElementById('avatar-letra').textContent = user_ranking.nombre.charAt(0).toUpperCase();
}

// 2. Lógica de filtros
function activarFiltro(btn) {
    document.querySelectorAll('.filtro').forEach(f => f.classList.remove('activo'));
    btn.classList.add('activo');
    
    // Aquí puedes añadir lógica real de filtrado después
    mostrarToast(`Filtrando por: ${btn.textContent}`);
}

// 3. Simulación de búsqueda
document.getElementById('input-search').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        mostrarToast(`Buscando: ${this.value}`);
    }
});