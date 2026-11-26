async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login.html';
}

async function loadCurrentAdmin() {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
        const data = await res.json();
        const el = document.getElementById('currentAdmin');
        if (el) el.textContent = `${data.email} (${data.role})`;
        if (data.role !== 'admin') {
            document.querySelectorAll('.admin-only').forEach(e => e.style.display = 'none');
        }
    }
}

loadCurrentAdmin();
