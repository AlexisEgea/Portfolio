function ensureGate() {
    if (document.querySelector('.desktop-gate')) {
        return;
    }

    const gate = document.createElement('section');
    gate.className = 'desktop-gate';
    gate.innerHTML = `
        <div class="desktop-gate-card">
            <h1 class="desktop-gate-title">Phone window</h1>
            <p class="desktop-gate-text">This portfolio is only available at a phone window size. Open the inspector and switch the viewport to a mobile size.</p>
        </div>
    `;
    document.body.appendChild(gate);
}

export function bindDesktopGate() {
    ensureGate();
}
