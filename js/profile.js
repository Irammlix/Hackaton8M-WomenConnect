// js/profile.js — Mi Espacio · WomenConnect
// Combina la lógica de navegación de páginas (perfil.js)
// con la carga de identidad del usuario (profile.js original)

// ─────────────────────────────────────────────────────
// 1. SISTEMA DE PÁGINAS
//    Muestra la página con el id dado, oculta las demás
// ─────────────────────────────────────────────────────
function mostrarPagina(idPagina) {
  const todasLasPaginas = document.querySelectorAll('.pagina');
  todasLasPaginas.forEach(function(p) {
    p.classList.remove('activa');
  });

  const destino = document.getElementById(idPagina);
  if (destino) {
    destino.classList.add('activa');
    // Scroll al tope del área de contenido
    const contenido = document.getElementById('main-contenido');
    if (contenido) {
      contenido.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }
}

// ─────────────────────────────────────────────────────
// 2. DELEGACIÓN DE CLICS — intercepta [data-destino]
// ─────────────────────────────────────────────────────
document.addEventListener('click', function(e) {
  const el = e.target.closest('[data-destino]');
  if (el) {
    e.preventDefault();
    mostrarPagina(el.getAttribute('data-destino'));
  }
});

// ─────────────────────────────────────────────────────
// 3. INICIALIZACIÓN AL CARGAR EL DOM
// ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

  // Cargar identidad del usuario desde localStorage
  cargarPerfil();

  // Botón cerrar sesión del sidebar
  var btnSidebar = document.getElementById('btnCerrarSesion');
  if (btnSidebar) {
    btnSidebar.addEventListener('click', function() {
      mostrarPagina('pagina-sesion-cerrada');
    });
  }

  // Botón cerrar sesión del menú móvil
  var btnMovil = document.getElementById('btnCerrarSesionMovil');
  if (btnMovil) {
    btnMovil.addEventListener('click', function() {
      cerrarMenuMovil();
      mostrarPagina('pagina-sesion-cerrada');
    });
  }

  // Botón cerrar sesión al pie de la página perfil
  var btnPie = document.getElementById('btnCerrarSesion2');
  if (btnPie) {
    btnPie.addEventListener('click', function() {
      mostrarPagina('pagina-sesion-cerrada');
    });
  }

  // Manejo de imágenes rotas
  inicializarImagenes();
});

// ─────────────────────────────────────────────────────
// 4. CARGAR IDENTIDAD DEL USUARIO
// ─────────────────────────────────────────────────────
function cargarPerfil() {
  var datos = {};
  try {
    datos = JSON.parse(localStorage.getItem('wc_usuario') || '{}');
  } catch(e) {}

  var nombreUI = document.getElementById('nombre-usuario');
  var avatarUI = document.getElementById('avatar-letra');

  if (datos.nombre) {
    if (nombreUI) nombreUI.textContent = datos.nombre;
    if (avatarUI) avatarUI.textContent = datos.nombre.charAt(0).toUpperCase();
  }
}

// ─────────────────────────────────────────────────────
// 5. MENÚ MÓVIL
// ─────────────────────────────────────────────────────
function abrirMenu() {
  var menu = document.getElementById('menu-movil');
  if (menu) menu.classList.toggle('abierto');
}

function cerrarMenuMovil() {
  var menu = document.getElementById('menu-movil');
  if (menu) menu.classList.remove('abierto');
}

// Cerrar menú móvil al hacer clic fuera
document.addEventListener('click', function(e) {
  var menu = document.getElementById('menu-movil');
  var btnMenu = document.querySelector('.btn-menu');
  if (menu && menu.classList.contains('abierto')) {
    if (!menu.contains(e.target) && e.target !== btnMenu && !btnMenu.contains(e.target)) {
      menu.classList.remove('abierto');
    }
  }
});

// ─────────────────────────────────────────────────────
// 6. MANEJO DE IMÁGENES ROTAS
// ─────────────────────────────────────────────────────
function activarPlaceholder(img) {
  img.style.display = 'none';
  var ph = img.nextElementSibling;
  if (ph) ph.style.display = 'flex';
}

function inicializarImagenes() {
  var imagenes = document.querySelectorAll(
    '.avatar-img, .empresa-icon, .verify-icon, .company-icon, .post-icon'
  );
  imagenes.forEach(function(img) {
    if (!img.complete || img.naturalWidth === 0) {
      activarPlaceholder(img);
    }
    img.addEventListener('error', function() {
      activarPlaceholder(img);
    });
  });
}

// ─────────────────────────────────────────────────────
// 7. TOAST DE NOTIFICACIÓN
// ─────────────────────────────────────────────────────
function mostrarToast(mensaje) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorialVerificaciones();
});

function cargarHistorialVerificaciones() {
    const ofertas = JSON.parse(localStorage.getItem('wc_ofertas_guardadas') || '[]');
    if (ofertas.length === 0) return; // Si no hay, dejamos las de muestra que ya tienes

    // Contenedores donde inyectaremos el HTML
    // 1. La tarjeta pequeña del perfil principal (buscamos el contenedor padre)
const contenedorResumen = document.querySelectorAll('#pagina-perfil .section-card')[1];    
// 2. La página completa de historial
    const contenedorHistorial = document.querySelector('#pagina-verificaciones .subpage-content');

    // Limpiamos los ejemplos de prueba estáticos (opcional, si quieres que solo salgan los reales)
    // contenedorResumen.innerHTML = '<div class="section-header"><h3 class="section-label">Mis verificaciones</h3><a href="#" class="link-ver" data-destino="pagina-verificaciones">Ver todas →</a></div>';
    // const tituloHistorial = '<h1 class="page-title">Historial de verificaciones</h1><p class="page-subtitle">Aquí se registran todas las ofertas que analizaste. Tu historial es privado.</p>';
    // contenedorHistorial.innerHTML = tituloHistorial;

    ofertas.forEach((oferta, index) => {
        // Mapear el texto de riesgo a clases CSS
        let claseCSS = 'safe';
        let iconoResumen = '✔';
        let iconoHistorial = '✅';
        
        const textoRiesgo = oferta.estado.toLowerCase();
        if (textoRiesgo.includes('alto')) {
            claseCSS = 'danger';
            iconoResumen = '⚠';
            iconoHistorial = '🚨';
        } else if (textoRiesgo.includes('medio')) {
            claseCSS = 'medio';
            iconoResumen = '🔍';
            iconoHistorial = '⚡';
        }

        // 1. Inyectar en el resumen (Perfil principal) - Solo mostramos las 3 más recientes
        if (index < 3 && contenedorResumen) {
            const htmlResumen = `
            <div class="verify-item verify-item--${claseCSS}">
              <div class="verify-icon-placeholder ${claseCSS}">${iconoResumen}</div>
              <div class="verify-info">
                <span class="verify-name">${oferta.titulo}</span>
                <span class="verify-risk ${claseCSS}">${iconoResumen} ${oferta.estado}</span>
              </div>
              <span class="verify-arrow">›</span>
            </div>`;
            contenedorResumen.insertAdjacentHTML('beforeend', htmlResumen);
        }

        // 2. Inyectar en el historial completo
        if (contenedorHistorial) {
            // Generar los chips (etiquetas)
            let htmlChips = '';
            oferta.etiquetas.forEach(etiqueta => {
                // Limpiar un poco el texto de la viñeta si es muy largo
                const textoCorto = etiqueta.length > 30 ? etiqueta.substring(0, 30) + '...' : etiqueta;
                htmlChips += `<span class="signal-chip">📌 ${textoCorto}</span>`;
            });

            const htmlHistorial = `
            <div class="verify-card ${claseCSS}">
              <div class="vcard-icon ${claseCSS}">${iconoHistorial}</div>
              <div class="vcard-body">
                <p class="vcard-title">${oferta.titulo}</p>
                <span class="vcard-badge ${claseCSS}">${iconoResumen} ${oferta.estado}</span>
                <p class="vcard-desc">${oferta.descripcion}</p>
                <div class="vcard-signals">
                  ${htmlChips}
                </div>
                <p class="vcard-date">Analizado el ${oferta.fecha}</p>
              </div>
            </div>`;
            contenedorHistorial.insertAdjacentHTML('beforeend', htmlHistorial);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorialPublicaciones();
});

function cargarHistorialPublicaciones() {
    const publicaciones = JSON.parse(localStorage.getItem('wc_mis_publicaciones') || '[]');
    if (publicaciones.length === 0) return; // Si no has publicado nada, deja los ejemplos estáticos

    // Contenedores
    // La tarjeta "Mis publicaciones" en el perfil principal (es la tarjeta #4)
    const contenedorResumen = document.querySelectorAll('#pagina-perfil .section-card')[3]; 
    // La subpágina con el historial completo
    const contenedorHistorial = document.querySelector('#pagina-publicaciones .subpage-content');

    publicaciones.forEach((pub, index) => {
        // 1. Dibujar en el resumen del perfil (solo mostramos la más reciente)
        if (index === 0 && contenedorResumen) {
            const htmlResumen = `
            <div class="post-item">
              <div class="post-icon-placeholder">✍️</div>
              <div class="post-info">
                <span class="post-tag">${pub.etiqueta}</span>
                <span class="post-meta">¡Recién publicado!</span>
              </div>
              <span class="verify-arrow">›</span>
            </div>`;
            contenedorResumen.insertAdjacentHTML('beforeend', htmlResumen);
        }

        // 2. Dibujar en el historial completo
        if (contenedorHistorial) {
            const visibilidad = pub.esAnonima ? '🔒 Anónima' : '🌎 Pública';
            const icono = pub.esAnonima ? '💬' : '👤';

            const htmlHistorial = `
            <div class="post-card">
              <div class="post-header">
                <div class="post-avatar">${icono}</div>
                <div class="post-meta-top">
                  <span class="post-hashtag">${pub.etiqueta}</span>
                  <span class="post-date">${pub.fecha}</span>
                </div>
              </div>
              <p class="post-text">${pub.texto}</p>
              <div class="post-stats">
                <div class="post-stat"><span>❤️</span> ${pub.likes} reacciones</div>
                <div class="post-stat"><span>💬</span> ${pub.comentarios} comentarios</div>
                <span class="post-visibility">${visibilidad}</span>
              </div>
            </div>`;
            
            // Lo insertamos justo debajo del subtítulo para que quede arriba de los viejos
            const subtitulo = contenedorHistorial.querySelector('.page-subtitle');
            if (subtitulo) {
                subtitulo.insertAdjacentHTML('afterend', htmlHistorial);
            }
        }
    });
}