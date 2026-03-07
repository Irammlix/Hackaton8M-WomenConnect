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


/* ---------- VALIA — CHAT ---------- */

// Respuestas de Valia según palabras clave


function agregarMensaje(texto, quien) {
  const chat = document.getElementById('chat-mensajes');
  if (!chat) return;

  const div = document.createElement('div');
  div.style.cssText = `
    max-width: 75%;
    margin-bottom: 16px;
    ${quien === 'valia' ? 'align-self: flex-start;' : 'align-self: flex-end;'}
  `;

  const burbuja = document.createElement('div');
  burbuja.style.cssText = quien === 'valia'
    ? 'background:#2A0E1C;color:#FFF0F5;padding:12px 16px;border-radius:4px 18px 18px 18px;font-size:14px;line-height:1.6;'
    : 'background:var(--rosa-fuerte);color:white;padding:12px 16px;border-radius:18px 4px 18px 18px;font-size:14px;line-height:1.6;';

  burbuja.innerHTML = texto.replace(/\n/g, "<br>");
  div.appendChild(burbuja);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function enviarMensaje() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const texto = input.value.trim();
  if (!texto) return;

  // Ocultar sugerencias
  const sugs = document.getElementById('sugerencias');
  if (sugs) sugs.style.display = 'none';

  agregarMensaje(texto, 'usuario');
  input.value = '';
  input.style.height = 'auto';

  // Mostrar "escribiendo..."
  const chat = document.getElementById('chat-mensajes');
  const typing = document.createElement('div');
  typing.id = 'typing';
  typing.style.cssText = 'align-self:flex-start;margin-bottom:16px;';
  typing.innerHTML = '<div style="background:#2A0E1C;color:#F5B8D0;padding:10px 16px;border-radius:4px 18px 18px 18px;font-size:13px;">Valia está escribiendo...</div>';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;

  // Respuesta después de un momento
  setTimeout(async () => {
  const t = document.getElementById('typing');
  if (t) t.remove();

  // Llamada al backend que conecta con Gemini
try {

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: texto })
  });

  const data = await res.json();

  agregarMensaje(data.respuesta, 'valia');

} catch (error) {

  agregarMensaje("Lo siento 😔 ocurrió un error. Intenta nuevamente.", "valia");

}
  }, 1000);
}

function mensajeRapido(texto) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = texto;
    enviarMensaje();
  }
}

function teclaEnter(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensaje();
  }
}

function ajustarAltura(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}



/* ---------- RANKING — FILTROS ---------- */
function activarFiltro(el) {
  document.querySelectorAll('.filtro').forEach(f => f.classList.remove('activo'));
  el.classList.add('activo');
}
