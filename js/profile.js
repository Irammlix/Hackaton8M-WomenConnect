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