/* =========================================================
   js/community.js — Lógica Unificada y Corregida
   ========================================================= */

// 1. GESTIÓN DE MODALES
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('abierto');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('abierto');
        document.body.style.overflow = '';
    }
}

// Cerrar al hacer clic fuera de la caja blanca
document.querySelectorAll('.modal-fondo').forEach(m => {
    m.addEventListener('click', e => {
        if (e.target === m) cerrarModal(m.id);
    });
});

// 2. SELECCIÓN DE TAGS 
function seleccionarEtiqueta(btn) {
    // Esta línea permite que el botón cambie de color (rosa/blanco) al tocarlo
    btn.classList.toggle('activo-tag');

}

/* --- FILTROS DEL FEED PRINCIPAL --- */
function filtrarTag(btn) {
    // Quita el estado activo de todos los filtros de la barra superior
    document.querySelectorAll('.ftag').forEach(b => b.classList.remove('active'));
    // Activa solo el que presionaste
    btn.classList.add('active');
}

// 3. ENVÍO DE FORMULARIOS (Nombres unificados)
function submitModal(idModal, mensaje) {
    const textarea = document.querySelector(`#${idModal} textarea`);

    // Validación simple
    if (textarea && textarea.value.trim() === "") {
        alert("Por favor, escribe tu experiencia antes de publicar.");
        return;
    }

    cerrarModal(idModal);
    mostrarToast(mensaje);

    // Limpieza
    if (textarea) textarea.value = "";
    document.querySelectorAll('.btn-tag').forEach(b => b.classList.remove('activo-tag'));
}

// 4. SWITCH DE ANONIMATO (Sin duplicados)
function updateToggleText(id) {
    // 1. Intentar encontrar elementos de Modal (anonExp, anonApoyo, etc.)
    const toggle = document.getElementById('anon' + id);
    const text = document.getElementById('toggleText' + id);

    // 2. Intentar encontrar elementos del Feed de Comentarios (anonToggle1, etc.)
    const feedToggle = document.getElementById('anonToggle' + id);
    const feedText = document.getElementById('toggleText' + id);
    const feedInput = document.getElementById('commentInput' + id);

    // Lógica para Modales
    if (toggle && text) {
        text.textContent = toggle.checked ? "ANÓNIMA" : "MI CUENTA";
        text.style.color = toggle.checked ? "var(--rosa-fuerte)" : "var(--texto-muted)";
    }

    // Lógica para Comentarios en el Feed
    if (feedToggle) {
        const isChecked = feedToggle.checked;
        if (feedText) {
            feedText.textContent = isChecked ? "Anónima" : "Mi cuenta";
            feedText.style.color = isChecked ? "var(--rosa-fuerte)" : "var(--texto-gris)";
        }
        if (feedInput) {
            feedInput.placeholder = isChecked ?
                "Escribe un comentario anónimo..." :
                "Escribe un comentario público...";
        }
    }
}

// 5. REACCIONES Y COMENTARIOS
function toggleLike(btn) {
    btn.classList.toggle('liked');
    const span = btn.querySelector('span');
    if (span) {
        let count = parseInt(span.textContent);
        span.textContent = btn.classList.contains('liked') ? count + 1 : count - 1;
    }
}

function toggleComments(id) {
    const section = document.getElementById('comments-' + id);
    if (section) section.classList.toggle('open');
}

// 6. SISTEMA DE TOAST
function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = mensaje;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3000);
}

function enviarComentario(btn) {
    const inputWrapper = btn.closest('.comment-input-wrapper');
    const input = inputWrapper.querySelector('.comment-input');
    const texto = input.value.trim();

    if (!texto) {
        alert("Escribe algo primero");
        return;
    }

    const container = btn.closest('.comments-section');
    const cajaEscribir = btn.closest('.comment-box-nic');

    // Detectar si es anónimo
    const toggle = cajaEscribir.querySelector('input[type="checkbox"]');
    const nombreAutor = (toggle && toggle.checked) ? '🔒 Tú (Anónima)' : '👤 Mi Cuenta';

    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `
        <div class="comment-text">${texto}</div>
        <div class="comment-meta">
            <span>${nombreAutor}</span>
            <span>ahora</span>
        </div>
    `;

    // Insertar el comentario arriba de la caja de texto
    container.insertBefore(item, cajaEscribir);

    // Limpiar input y avisar
    input.value = '';
    mostrarToast('Comentario publicado');
}