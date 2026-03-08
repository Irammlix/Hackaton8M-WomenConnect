
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
        
        // Magia anti-texto-pegado: Limpiamos el form al cerrar
        if (id === 'modal-experiencia' || id === 'modal-apoyo') {
            const textarea = modal.querySelector('textarea');
            if (textarea) textarea.value = ''; // Borra el texto
            
            // Reiniciamos los botones rosas para que no se quede marcada la alerta
            const botonesTag = modal.querySelectorAll('.btn-tag');
            if (botonesTag.length > 0) {
                botonesTag.forEach(b => b.classList.remove('activo-tag'));
                botonesTag[0].classList.add('activo-tag'); // Marca la primera por defecto
            }
        }
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
    // 1. Quita el estado activo de todos los botones y activa el presionado
    document.querySelectorAll('.ftag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2. Leemos qué dice el botón que presionaste (ej. "Todas" o "#Salarial")
    const filtro = btn.innerText.trim();

    // 3. Buscamos todas las publicaciones que hay en el muro
    const posts = document.querySelectorAll('#community-feed .post-card');

    // 4. Revisamos una por una para ver si la mostramos o la ocultamos
    posts.forEach(post => {
        // Buscamos la etiqueta de esa publicación específica
        const etiquetaElemento = post.querySelector('.post-tag');
        
        if (etiquetaElemento) {
            const etiquetaPost = etiquetaElemento.innerText.trim();

            // Si el filtro es "Todas" o la etiqueta coincide con el filtro, la mostramos
            if (filtro === 'Todas' || etiquetaPost === filtro) {
                post.style.display = 'block'; 
            } else {
                // Si no coincide, la escondemos
                post.style.display = 'none'; 
            }
        }
    });
}
   
// --- DIBUJAR LOS POSTS GUARDADOS EN EL MURO DE COMUNIDAD ---
document.addEventListener('DOMContentLoaded', () => {
    cargarPublicacionesEnComunidad();
    
    // Llamamos a la nueva función para pintar el nombre en el sidebar
    cargarDatosDeUsuariaEnComunidad(); 
    
    if(typeof recibirBorradorDeValia === 'function') recibirBorradorDeValia();
});

function cargarPublicacionesEnComunidad() {
    const feed = document.getElementById('community-feed');
    if (!feed) return;

    const publicaciones = JSON.parse(localStorage.getItem('wc_mis_publicaciones') || '[]');
    
    let htmlNuevo = "";
    publicaciones.forEach((pub, index) => {
        const nombreAutor = pub.esAnonima ? "🔒 Usuario Anónima" : "👤 Mi Cuenta";
        const colorAvatar = pub.esAnonima ? "var(--rosa-fuerte)" : "var(--lila-claro)";
        const letraAvatar = pub.esAnonima ? "U" : "M";
        const idUnico = `dinamico-${index}`; 

        let adjuntoHTML = "";
        if (pub.archivoDato) {
            if (pub.tipoArchivo === 'imagen') {
                adjuntoHTML = `<div style="margin-top: 12px; border-radius: 8px; overflow: hidden; border: 1px solid var(--borde);">
                                  <img src="${pub.archivoDato}" style="max-width: 100%; display: block;" alt="Imagen adjunta">
                               </div>`;
            } else {
                adjuntoHTML = `<div style="margin-top: 12px; padding: 12px; background: var(--rosa-claro); border-radius: 8px; border: 1px dashed var(--rosa-medio); color: var(--rosa-fuerte); font-weight: bold;">
                                  📎 Documento adjunto cargado
                               </div>`;
            }
        }

        htmlNuevo += `
        <div class="post-card" style="border: 1px solid var(--rosa-medio); box-shadow: 0 4px 10px rgba(183,28,99,0.1);">
          <div class="post-header">
            <div class="post-author">
              <div class="author-avatar" style="background: ${colorAvatar}; color: white;">${letraAvatar}</div>
              <div class="author-info">
                <div class="author-name">${nombreAutor}</div>
                <div class="author-time">${pub.fecha}</div>
              </div>
            </div>
            <span style="background: var(--rosa-claro); color: var(--rosa-fuerte); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; margin-left: auto;">¡Nuevo!</span>
          </div>
          <span class="post-tag">${pub.etiqueta}</span>
          <p class="post-text">${pub.texto}</p>
          
          ${adjuntoHTML} <div class="post-footer">
            <div class="post-reactions">
              <button class="reaction-btn" onclick="toggleLike(this)">❤️ <span>${pub.likes || 0}</span></button>
              <button class="reaction-btn" onclick="toggleComments('${idUnico}')">💬 <span>${pub.comentarios || 0}</span></button>
              <button class="reaction-btn" onclick="abrirModal('modal-apoyo')">🤝 Apoyar</button>
            </div>
          </div>
          
          <div class="comments-section" id="comments-${idUnico}">
            <div class="comment-box-nic">
              <div class="comment-box-header">
                <label class="switch-sm">
                  <input type="checkbox" id="anonToggle${idUnico}" checked onchange="updateToggleText('${idUnico}')">
                  <span class="slider-sm"></span>
                </label>
                <span id="toggleText${idUnico}" class="privacy-label-text">Anónima</span>
              </div>
              <div class="comment-input-wrapper">
                <input class="comment-input" id="commentInput${idUnico}" type="text" placeholder="Escribe un comentario anónimo...">
                <button class="btn-send-comment" onclick="enviarComentario(this)">Enviar</button>
              </div>
            </div>
          </div>

        </div>`;
    });
    feed.insertAdjacentHTML('afterbegin', htmlNuevo);
}


// 3. ENVÍO DE FORMULARIOS Y GUARDADO DE PUBLICACIONES
function submitModal(idModal, mensaje) {
    const textarea = document.querySelector(`#${idModal} textarea`);

    if (textarea && textarea.value.trim() === "") {
        alert("Por favor, escribe tu experiencia antes de publicar.");
        return;
    }

    if (idModal === 'modal-experiencia') {
        const textoPost = textarea.value.trim();
        const tagSeleccionado = document.querySelector(`#${idModal} .btn-tag.activo-tag`);
        const textoTag = tagSeleccionado ? tagSeleccionado.innerText : "#Experiencia";
        const toggleAnon = document.getElementById('anonExp');
        const esAnonima = toggleAnon ? toggleAnon.checked : true;
        
        const opcionesFecha = { day: 'numeric', month: 'short', year: 'numeric' };
        const fechaHoy = new Date().toLocaleDateString('es-ES', opcionesFecha);

        const inputArchivo = document.querySelector(`#${idModal} input[type="file"]`);
        
        if (inputArchivo && inputArchivo.files.length > 0) {
            const archivo = inputArchivo.files[0];
            const lector = new FileReader();
            
            // Leemos el archivo y lo convertimos a un formato que el navegador pueda guardar
            lector.onload = function(evento) {
                const archivoBase64 = evento.target.result;
                const esImagen = archivo.type.startsWith('image/');
                
                guardarPublicacionEnMemoria(textoPost, textoTag, fechaHoy, esAnonima, archivoBase64, esImagen ? 'imagen' : 'documento');
            };
            lector.readAsDataURL(archivo);
        } else {
            guardarPublicacionEnMemoria(textoPost, textoTag, fechaHoy, esAnonima, null, null);
        }
    } else {
        cerrarModal(idModal);
        mostrarToast(mensaje, idModal);
    }

    // --- FUNCIÓN INTERNA PARA GUARDAR (Para no repetir código) ---
    function guardarPublicacionEnMemoria(texto, etiqueta, fecha, anonima, archivoB64, tipoArchivo) {
        let misPublicaciones = JSON.parse(localStorage.getItem('wc_mis_publicaciones') || '[]');
        misPublicaciones.unshift({
            id: Date.now(),
            texto: texto,
            etiqueta: etiqueta,
            fecha: `Publicado el ${fecha}`,
            esAnonima: anonima,
            likes: 0,
            comentarios: 0,
            archivoDato: archivoB64, // Aquí guardamos la imagen convertida
            tipoArchivo: tipoArchivo
        });
        localStorage.setItem('wc_mis_publicaciones', JSON.stringify(misPublicaciones));

        // Limpiamos todo y cerramos
        cerrarModal(idModal);
        mostrarToast(mensaje, idModal);
        if (textarea) textarea.value = "";
        if (document.querySelector(`#${idModal} input[type="file"]`)) {
            document.querySelector(`#${idModal} input[type="file"]`).value = "";
        }
        document.querySelectorAll('.btn-tag').forEach(b => b.classList.remove('activo-tag'));
    }
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
function mostrarToast(mensaje, idModal) { // <-- ¡Aquí faltaba recibir el idModal!
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = mensaje;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3000);
    
    // Si publicamos una experiencia, recargamos la página rápido para verla en el muro
    if (idModal === 'modal-experiencia') {
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
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

/* --- RECEPTOR DE ALERTAS DE VALIA --- */
document.addEventListener('DOMContentLoaded', () => {
    recibirBorradorDeValia();
});

function recibirBorradorDeValia() {
    // 1. Revisamos si Valia mandó un borrador
    const alertaString = localStorage.getItem('wc_alerta_pendiente');
    if (alertaString) {
        const alerta = JSON.parse(alertaString);

        // 2. Abrimos la ventanita (modal) automáticamente
        abrirModal('modal-experiencia');

        // 3. Llenamos el texto en el textarea
        const textarea = document.querySelector('#modal-experiencia textarea');
        if (textarea) {
            textarea.value = alerta.texto;
        }

        // 4. Lógica para seleccionar el tag correcto
        const botonesTag = document.querySelectorAll('#modal-experiencia .btn-tag');
        let tagEncontrado = false;

        // Quitamos la clase "activo-tag" a los que la tengan por defecto
        botonesTag.forEach(btn => btn.classList.remove('activo-tag'));

        // Buscamos si el tag sugerido ya existe en tus botones
        botonesTag.forEach(btn => {
            if (btn.innerText.includes(alerta.etiqueta)) {
                btn.classList.add('activo-tag');
                tagEncontrado = true;
            }
        });

        // Si el tag es nuevo, lo creamos dinámicamente y lo seleccionamos
        if (!tagEncontrado) {
            const contenedorTags = document.querySelector('#modal-experiencia .tag-selector-nic');
            if (contenedorTags) {
                const nuevoBtn = document.createElement('button');
                nuevoBtn.className = 'btn-tag activo-tag';
                nuevoBtn.innerText = alerta.etiqueta;
                // Le agregamos su función de clic para que funcione como los otros
                nuevoBtn.onclick = function() { seleccionarEtiqueta(this) }; 
                
                // Lo ponemos de primerito en la lista
                contenedorTags.prepend(nuevoBtn); 
            }
        }

        // 5. ¡Importante! Borramos la memoria para que el modal no se siga abriendo cada vez que la usuaria actualice la página
        localStorage.removeItem('wc_alerta_pendiente');
    }
}

// --- CARGAR DATOS DE USUARIA ---
function cargarDatosDeUsuariaEnComunidad() {
    const usuarioString = localStorage.getItem('wc_usuario');
    
    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        
        if (usuario.nombre) {
            // Busca los elementos en el sidebar de la página de Comunidad
            const nombreElem = document.getElementById('nombre-usuario');
            const avatarLetra = document.getElementById('avatar-letra');
            
            // Si existen, actualiza el contenido
            if (nombreElem) nombreElem.textContent = usuario.nombre;
            if (avatarLetra) avatarLetra.textContent = usuario.nombre.charAt(0).toUpperCase();
        }
    }
}

// --- MOSTRAR NOMBRE DEL ARCHIVO CARGADO ---
document.addEventListener('DOMContentLoaded', () => {
    const inputFile = document.getElementById('file-post');
    const btnUpload = document.querySelector('.btn-upload-nic');

    if (inputFile && btnUpload) {
        inputFile.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                // Cambia el texto del botón al nombre del archivo
                btnUpload.innerHTML = `✅ Archivo listo: ${this.files[0].name}`;
                btnUpload.style.background = 'var(--rosa-claro)';
                btnUpload.style.border = '1px solid var(--rosa-fuerte)';
            } else {
                // Vuelve al texto original si cancela
                btnUpload.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> Añadir foto o evidencia`;
            }
        });
    }
});
