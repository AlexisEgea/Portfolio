import { applyFullscreenCloneStyle, createZoomClone } from './zoomClone.js';
import { zoomOut } from './dezoom.js';

// Animates a grid card from its cell to fullscreen.
export function zoomIn(sectionClass, options = {}) {
    const { disableZoomOutClick = false, onZoomInComplete = null } = options;
    const box = document.querySelector(`.box.${sectionClass}`);
    if (!box) {
        return null;
    }

    const boxCoverElement = document.querySelector(`.${sectionClass} .box-cover`);
    if (boxCoverElement) {
        boxCoverElement.classList.remove('fade-in');
        boxCoverElement.classList.add('fade-out');
    }

    const boxDataElement = document.querySelector(`.${sectionClass} .box-data`);
    if (boxDataElement) {
        boxDataElement.classList.remove('fade-out');
        boxDataElement.classList.add('fade-in');
    }

    const boxRect = box.getBoundingClientRect();
    const clone = createZoomClone(box, boxRect);
    document.body.appendChild(clone);
    clone.offsetHeight;
    applyFullscreenCloneStyle(clone);

    if (typeof onZoomInComplete === 'function') {
        clone.addEventListener('transitionend', () => {
            onZoomInComplete(sectionClass, clone);
        }, { once: true });
    }

    if (!disableZoomOutClick) {
        clone.addEventListener('click', () => {
            zoomOut(clone, boxRect, sectionClass);
        });
    }

    return clone;
}
