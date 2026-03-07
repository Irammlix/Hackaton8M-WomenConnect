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

    /* ---- Estrellas ---- */
    function setStars(btn, n, grupo) {
      const fila = btn.closest('.stars-row');
      fila.querySelectorAll('.star-btn').forEach((s, i) => {
        s.classList.toggle('activa', i < n);
      });
    }

    /* ---- Tags ---- */
    function toggleTag(btn) { btn.classList.toggle('seleccionada'); }

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