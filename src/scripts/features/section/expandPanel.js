import {
    PANEL_EXPAND_DURATION_MS,
    PANEL_EXPAND_EASING,
    PANEL_EXPAND_INSET_X,
    PANEL_EXPAND_VERTICAL_RATIO
} from '../../config/panel.js';
import { qsa, qs } from '../../shared/dom.js';

let activeExpansion = null;

function getFrame() {
    return qs('.section-page') || document.body;
}

function getViewportRect() {
    const viewport = window.visualViewport;
    if (viewport) {
        return {
            top: viewport.offsetTop,
            left: viewport.offsetLeft,
            width: viewport.width,
            height: viewport.height
        };
    }

    return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
    };
}

function intersectRects(first, second) {
    const top = Math.max(first.top, second.top);
    const left = Math.max(first.left, second.left);
    const right = Math.min(first.left + first.width, second.left + second.width);
    const bottom = Math.min(first.top + first.height, second.top + second.height);

    return {
        top,
        left,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top)
    };
}

function getFrameRect() {
    const viewport = getViewportRect();
    const section = qs('.section-page');
    if (section && window.matchMedia('(min-width: 500px)').matches) {
        const rect = section.getBoundingClientRect();
        return intersectRects({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        }, viewport);
    }

    return viewport;
}

function coverFrame(element) {
    const frameRect = getFrameRect();
    element.style.inset = 'auto';
    applyRect(element, {
        top: frameRect.top,
        left: frameRect.left,
        width: frameRect.width,
        height: frameRect.height
    });
}

// Returns true when the user prefers reduced motion.
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Builds the CSS transition used while a panel expands or collapses.
function getExpandTransition() {
    const duration = prefersReducedMotion() ? 0 : PANEL_EXPAND_DURATION_MS;
    const properties = ['top', 'left', 'width', 'height', 'border-radius', 'padding', 'box-shadow'];
    return properties
        .map((property) => `${property} ${duration}ms ${PANEL_EXPAND_EASING}`)
        .join(', ');
}

// Computes the expanded card bounds inside the phone frame.
function getExpandedRect() {
    const frameRect = getFrameRect();
    const verticalInset = frameRect.height * PANEL_EXPAND_VERTICAL_RATIO;

    return {
        top: frameRect.top + verticalInset,
        left: frameRect.left + PANEL_EXPAND_INSET_X,
        width: Math.max(0, frameRect.width - PANEL_EXPAND_INSET_X * 2),
        height: Math.max(0, frameRect.height - verticalInset * 2)
    };
}

// Applies a viewport rectangle to a fixed-position element.
function applyRect(element, rect) {
    element.style.top = `${rect.top}px`;
    element.style.left = `${rect.left}px`;
    element.style.width = `${rect.width}px`;
    element.style.height = `${rect.height}px`;
}

// Creates the dimmed backdrop shown behind an expanded panel.
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'panel-expand-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    return overlay;
}

// Creates a fixed clone of the source panel, starting at its current screen position.
function createClone(panel, rect) {
    const clone = panel.cloneNode(true);
    clone.classList.add('panel-expand-clone');
    clone.removeAttribute('tabindex');
    clone.removeAttribute('aria-expanded');
    clone.setAttribute('role', 'dialog');
    clone.setAttribute('aria-modal', 'true');
    clone.style.position = 'fixed';
    clone.style.margin = '0';
    clone.style.zIndex = '1000';
    clone.style.transform = 'none';
    clone.style.transition = 'none';
    clone.style.cursor = 'pointer';
    applyRect(clone, rect);
    return clone;
}

// Animates the expanded clone back to the source panel, then restores the grid.
function collapsePanel() {
    if (!activeExpansion || activeExpansion.isClosing) {
        return;
    }

    const { panel, clone, overlay, onKeydown, onResize } = activeExpansion;
    activeExpansion.isClosing = true;
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);

    const targetRect = panel.getBoundingClientRect();
    clone.classList.remove('is-expanded');
    overlay.classList.remove('is-visible');
    applyRect(clone, targetRect);

    let isFinalized = false;
    // Removes the clone and overlay once the collapse animation has finished.
    const finalize = () => {
        if (isFinalized) {
            return;
        }
        isFinalized = true;
        clone.removeEventListener('transitionend', onEnd);
        panel.classList.remove('is-source-hidden');
        panel.classList.add('is-restoring');
        panel.setAttribute('aria-expanded', 'false');
        panel.removeAttribute('aria-hidden');
        document.body.classList.remove('is-panel-expanded');
        document.body.style.removeProperty('overflow');
        requestAnimationFrame(() => {
            clone.remove();
            overlay.remove();
            activeExpansion = null;
            window.setTimeout(() => {
                panel.classList.remove('is-restoring');
            }, 50);
        });
    };

    // Finalizes only after the clone size has finished transitioning.
    const onEnd = (event) => {
        if (event.target !== clone) {
            return;
        }
        if (event.propertyName !== 'width' && event.propertyName !== 'height') {
            return;
        }
        finalize();
    };

    clone.addEventListener('transitionend', onEnd);
    window.setTimeout(finalize, prefersReducedMotion() ? 0 : PANEL_EXPAND_DURATION_MS + 80);
}

// Expands a panel from its grid cell to the centered overlay card.
function expandPanel(panel) {
    if (activeExpansion) {
        return;
    }

    panel.style.transform = 'none';
    const sourceRect = panel.getBoundingClientRect();
    panel.style.removeProperty('transform');

    const overlay = createOverlay();
    const clone = createClone(panel, sourceRect);

    panel.classList.add('is-source-hidden');
    panel.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'true');
    coverFrame(overlay);
    const frame = getFrame();
    frame.appendChild(overlay);
    frame.appendChild(clone);
    document.body.classList.add('is-panel-expanded');
    document.body.style.overflow = 'hidden';

    // Closes the expanded panel when Escape is pressed.
    const onKeydown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            collapsePanel();
        }
    };

    // Closes the expanded panel on backdrop/card clicks, unless a control was used.
    let touchMoved = false;
    const onTouchStart = () => {
        touchMoved = false;
    };
    const onTouchMove = () => {
        touchMoved = true;
    };
    const onDismissClick = (event) => {
        if (touchMoved) {
            touchMoved = false;
            event.stopPropagation();
            return;
        }
        if (event.target.closest('.settings-control')) {
            event.stopPropagation();
            return;
        }
        event.stopPropagation();
        collapsePanel();
    };

    clone.addEventListener('touchstart', onTouchStart, { passive: true });
    clone.addEventListener('touchmove', onTouchMove, { passive: true });
    clone.addEventListener('click', onDismissClick);
    overlay.addEventListener('click', onDismissClick);
    document.addEventListener('keydown', onKeydown);

    // Keeps the expanded card aligned if the viewport is resized.
    const onResize = () => {
        if (!activeExpansion || activeExpansion.isClosing) {
            return;
        }
        coverFrame(overlay);
        applyRect(clone, getExpandedRect());
    };
    window.addEventListener('resize', onResize);

    activeExpansion = { panel, clone, overlay, onKeydown, onResize, isClosing: false };

    clone.offsetHeight;
    overlay.offsetHeight;

    clone.style.transition = getExpandTransition();
    overlay.classList.add('is-visible');
    clone.classList.add('is-expanded');
    applyRect(clone, getExpandedRect());
}

// Opens a panel from a user interaction without triggering the page return shortcut.
function openFromPanel(event, panel) {
    event.preventDefault();
    event.stopPropagation();
    expandPanel(panel);
}

// Binds App Store-style expand/collapse on every panel of a section page.
export function bindPanelExpansion(container) {
    if (!container) {
        return;
    }

    qsa('.panel', container).forEach((panel) => {
        panel.setAttribute('role', 'button');
        panel.tabIndex = 0;
        panel.setAttribute('aria-expanded', 'false');
        panel.addEventListener('click', (event) => openFromPanel(event, panel));
        panel.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                openFromPanel(event, panel);
            }
        });
    });
}
