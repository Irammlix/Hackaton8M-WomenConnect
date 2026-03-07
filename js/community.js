function abrirModal(id) {
    document.getElementById(id).classList.add('abierto');
    document.body.style.overflow = 'hidden';
}
function cerrarModal(id) {
    document.getElementById(id).classList.remove('abierto');
    document.body.style.overflow = '';
}
// Cerrar al click fuera
document.querySelectorAll('.modal-fondo').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) cerrarModal(m.id); });
});

// Menú móvil
function abrirMenu() {
    document.getElementById('menu-movil').classList.toggle('abierto');
}

// Etiquetas
function seleccionarEtiqueta(btn) {
    btn.closest('.tag-selector').querySelectorAll('.btn-tag').forEach(b => b.classList.remove('activo-tag'));
    btn.classList.add('activo-tag');
}

// Filtros del feed
function filtrarTag(btn) {
    document.querySelectorAll('.ftag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Like en posts
function toggleLike(btn) {
    btn.classList.toggle('liked');
    const span = btn.querySelector('span');
    span.textContent = btn.classList.contains('liked')
    ? parseInt(span.textContent) + 1
    : parseInt(span.textContent) - 1;
}

// Comentarios
function toggleComments(id) {
    const section = document.getElementById('comments-' + id);
    section.classList.toggle('open');
}

// Like en comentarios
function toggleCommentLike(el) {
    el.classList.toggle('liked');
    const span = el.querySelector('span');
    span.textContent = el.classList.contains('liked')
    ? parseInt(span.textContent) + 1
    : parseInt(span.textContent) - 1;
}

// Enviar comentario
function enviarComentario(btn) {
    const input = btn.previousElementSibling;
    const texto = input.value.trim();
    if (!texto) return;
    const container = btn.closest('.comments-section');
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `<div class="comment-text">${texto}</div>
    <div class="comment-meta"><span>🔒 Tú (anónima)</span><span>ahora</span></div>`;
    container.insertBefore(item, btn.closest('.comment-box-container'));
    input.value = '';
    mostrarToast('Comentario publicado');
}

// Submit modal con toast
function submitModal(id, mensaje) {
    cerrarModal(id);
    mostrarToast(mensaje);
}

// Toast
function mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3000);
}