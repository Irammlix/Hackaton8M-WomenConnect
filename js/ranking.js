/* ---- Navegación lista <-> perfil ---- */
function mostrarPerfil() {
  document.getElementById('vista-lista').style.display = 'none';
  document.getElementById('vista-perfil').style.display = 'block';
  window.scrollTo(0, 0);
}
function volverRanking() {
  document.getElementById('vista-perfil').style.display = 'none';
  document.getElementById('vista-lista').style.display = 'block';
  window.scrollTo(0, 0);
}

/* ---- Filtros avanzados ---- */
function toggleFiltros() {
  const panel = document.getElementById('panel-filtros');
  const btn = document.getElementById('btn-filtros');
  panel.classList.toggle('abierto');
  btn.classList.toggle('activo');
}
function aplicarFiltros() {
  const panel = document.getElementById('panel-filtros');
  panel.classList.remove('abierto');
  document.getElementById('btn-filtros').classList.remove('activo');
  mostrarToast('✅ Filtros aplicados');
}
function limpiarFiltros() {
  document.querySelectorAll('.filtro-select').forEach(s => s.selectedIndex = 0);
  mostrarToast('Filtros limpiados');
}

/* ---- Favorito ---- */
function toggleFav() {
  const btn = document.getElementById('btnFav');
  btn.classList.toggle('activo');
  btn.querySelector('svg').style.fill = btn.classList.contains('activo') ? 'var(--rosa-fuerte)' : 'none';
  mostrarToast(btn.classList.contains('activo') ? '❤️ Empresa guardada' : 'Empresa eliminada de guardados');
}

/* ---- Estrellas Actualizado (Nic) ---- */
function setStars(btn, n) {
  // Buscamos el contenedor de estrellas más cercano
  const container = btn.closest('.stars-container-nic');

  // Seleccionamos todas las estrellas de ese grupo
  const stars = container.querySelectorAll('.star-btn');

  stars.forEach((s, i) => {
    // Usamos 'active' para que coincida con tu CSS
    if (i < n) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
}

// Función para seleccionar/deseleccionar tags
function toggleEtiqueta(btn) {
  btn.classList.toggle('activo-tag');
}

// Función para enviar y cerrar con aviso
function submitFormulario(modalId, mensaje) {
  // Cerramos el modal
  cerrarModal(modalId);

  // Disparamos un aviso (puedes usar un alert o un toast si lo tienes)
  alert(mensaje);

  // Opcional: Limpiar los campos si quieres
  location.reload();
}

/* ---- Modales ---- */
function abrirModal(id) {
  const m = document.getElementById(id);
  m.classList.add('abierto');
  document.body.style.overflow = 'hidden';
}
function cerrarModal(id) {
  document.getElementById(id).classList.remove('abierto');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-fondo').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) cerrarModal(m.id); });
});

/* ---- Submit reseña ---- */
function submitModal(id) {
  cerrarModal(id);
  mostrarToast('✅ ¡Reseña enviada! Gracias por ayudar a otras mujeres.');
}

/* ---- Submit empresa ---- */
function submitEmpresa() {
  cerrarModal('modal-empresa');
  mostrarToast('🏢 ¡Empresa registrada! Quedará pendiente de validación.');
}

/* ---- Toast ---- */
function mostrarToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('visible');
  setTimeout(() => t.classList.remove('visible'), 3000);
}

/* ---- Menu móvil ---- */
function abrirMenu() {
  document.getElementById('menu-movil').classList.toggle('abierto');
}

function updateToggleText(id) {
  const toggle = document.getElementById('anon' + id);
  const text = document.getElementById('toggleText' + id);

  if (toggle.checked) {
    text.textContent = "ANÓNIMA";
    text.style.color = "var(--rosa-fuerte)"; // Rosa cuando está activo
  } else {
    text.textContent = "MI CUENTA";
    text.style.color = "var(--texto-muted)"; // Gris cuando está desactivado
  }
}