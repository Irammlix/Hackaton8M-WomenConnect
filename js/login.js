let anonActivo = false;

function cambiarTab(tab) {
    document.getElementById('tab-login').classList.toggle('activo', tab === 'login');
    document.getElementById('tab-registro').classList.toggle('activo', tab === 'registro');
    document.getElementById('form-login').classList.toggle('activo', tab === 'login');
    document.getElementById('form-registro').classList.toggle('activo', tab === 'registro');
}

function toggleAnon() {
    anonActivo = !anonActivo;
    const check = document.getElementById('check-anon');
    check.classList.toggle('marcado', anonActivo);
    check.textContent = anonActivo ? '✓' : '';
}

function mostrarError(id, texto) {
    const el = document.getElementById(id);
    el.textContent = texto;
    el.classList.add('visible');
}

function iniciarSesion() {
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-pass').value;

    document.getElementById('error-login').classList.remove('visible');

    if (!email || !pass) {
    mostrarError('error-login', 'Por favor completa todos los campos.');
    return;
    }
    if (!email.includes('@')) {
    mostrarError('error-login', 'Ingresa un correo válido.');
    return;
    }

    // Guardar usuario en localStorage y redirigir
    localStorage.setItem('wc_usuario', JSON.stringify({ email, nombre: email.split('@')[0] }));
    window.location.href = 'home.html';
}

function registrarse() {
    const email = document.getElementById('reg-email').value.trim();
    const pass  = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;

    document.getElementById('error-registro').classList.remove('visible');

    if (!email || !pass || !pass2) {
    mostrarError('error-registro', 'Por favor completa todos los campos.');
    return;
    }
    if (!email.includes('@')) {
    mostrarError('error-registro', 'Ingresa un correo válido.');
    return;
    }
    if (pass.length < 8) {
    mostrarError('error-registro', 'La contraseña debe tener al menos 8 caracteres.');
    return;
    }
    if (pass !== pass2) {
    mostrarError('error-registro', 'Las contraseñas no coinciden.');
    return;
    }

    localStorage.setItem('wc_usuario', JSON.stringify({ email, nombre: email.split('@')[0], anon: anonActivo }));
    window.location.href = 'home.html';
}

function loginGoogle() {
    localStorage.setItem('wc_usuario', JSON.stringify({ email: 'ana@gmail.com', nombre: 'Ana' }));
    window.location.href = 'home.html';
}