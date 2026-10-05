export function isDesktopPhoneFrame() {
    return window.matchMedia('(min-width: 500px)').matches;
}

export function createZoomClone(box, boxRect) {
    const clone = box.cloneNode(true);
    clone.classList.add('zoom-clone');
    clone.style.position = 'fixed';
    clone.style.top = `${boxRect.top}px`;
    clone.style.left = `${boxRect.left}px`;
    clone.style.width = `${boxRect.width}px`;
    clone.style.height = `${boxRect.height}px`;
    clone.style.margin = '0';
    clone.style.transform = 'scale(1)';
    clone.style.transformOrigin = 'center center';
    clone.style.transition = 'transform 0.8s ease-in-out, top 0.8s ease-in-out, left 0.8s ease-in-out, width 0.8s ease-in-out, height 0.8s ease-in-out, border-radius 0.8s ease-in-out';
    clone.style.zIndex = '1000';
    return clone;
}

// Uses innerHeight to avoid mobile viewport height jumps.
export function getStableViewportHeightPx() {
    return `${window.innerHeight}px`;
}

// Places the clone in fullscreen, matching the section-page viewport.
export function applyFullscreenCloneStyle(clone) {
    const frame = document.querySelector('.main-grid') || document.querySelector('.section-page');
    if (frame) {
        const rect = frame.getBoundingClientRect();
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.transform = 'scale(1)';
        if (isDesktopPhoneFrame()) {
            clone.style.borderRadius = '20px';
            clone.style.overflow = 'hidden';
        }
        return;
    }

    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '100vw';
    clone.style.height = getStableViewportHeightPx();
    clone.style.transform = 'scale(1)';
}

// Animates the clone back to a card rect, then removes it.
export function animateCloneToRect(clone, rect, onComplete = null) {
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.transform = 'scale(1)';

    const watchedProps = new Set(['width', 'height']);
    let isFinalized = false;

    const finalize = () => {
        if (isFinalized) {
            return;
        }
        isFinalized = true;
        clone.removeEventListener('transitionend', onEnd);
        clone.remove();
        if (typeof onComplete === 'function') {
            onComplete();
        }
    };

    const onEnd = (event) => {
        if (event.target !== clone) {
            return;
        }
        if (!watchedProps.has(event.propertyName)) {
            return;
        }
        finalize();
    };

    clone.addEventListener('transitionend', onEnd);
    window.setTimeout(finalize, 840);
}
