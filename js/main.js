/* =============================================
   WomenConnect — app.js
   JavaScript compartido por todas las páginas
   ============================================= */


/* ---------- TOAST (notificación pequeña) ---------- */
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2500);
}


/* ---------- MENÚ MÓVIL ---------- */
function abrirMenu() {
  const menu = document.getElementById('menu-movil');
  if (menu) {
    menu.classList.toggle('abierto');
  }
}


/* ---------- MODALES ---------- */
function abrirModal(id) {
  document.getElementById(id).classList.add('abierto');
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('abierto');
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-fondo')) {
    e.target.classList.remove('abierto');
  }
});


/* ---------- LIKES ---------- */
const likeDados = {};

function darLike(id) {
  const btn = document.getElementById('like-' + id);
  const contador = document.getElementById('contador-' + id);
  let n = parseInt(contador.textContent);

  if (likeDados[id]) {
    n--;
    likeDados[id] = false;
    btn.classList.remove('liked');
  } else {
    n++;
    likeDados[id] = true;
    btn.classList.add('liked');
    mostrarToast('💙 Reacción registrada');
  }
  contador.textContent = n;
}


/* ---------- COMENTARIOS ---------- */
function enviarComentario(postId) {
  const input = document.getElementById('comentario-' + postId);
  const texto = input.value.trim();
  if (!texto) return;

  const seccion = document.getElementById('comentarios-' + postId);
  const div = document.createElement('div');
  div.style.cssText = 'background:#FFF5F8;border:1px solid #F0D0DC;border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px;color:#1A1A22;';
  div.textContent = texto;
  seccion.insertBefore(div, seccion.lastElementChild);

  input.value = '';
  mostrarToast('✨ Comentario publicado');
}


/* ---------- PUBLICAR POST ---------- */
function publicarPost() {
  const texto = document.getElementById('texto-post').value.trim();
  if (!texto) {
    mostrarToast('Escribe algo antes de publicar');
    return;
  }

  const feed = document.getElementById('feed');
  const div = document.createElement('div');
  div.className = 'post animar';
  div.innerHTML = `
    <span class="badge">#MiExperiencia</span>
    <p class="post-texto">${texto}</p>
    <div class="post-pie">
      <span class="anon-label">🔒 Anónima · ahora</span>
    </div>
  `;
  feed.insertBefore(div, feed.firstChild);

  document.getElementById('texto-post').value = '';
  cerrarModal('modal-publicar');
  mostrarToast('✨ Publicación enviada');
}


/* ---------- RANKING — FILTROS ---------- */
function activarFiltro(el) {
  document.querySelectorAll('.filtro').forEach(f => f.classList.remove('activo'));
  el.classList.add('activo');
}
