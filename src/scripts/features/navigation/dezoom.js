import { animateCloneToRect, applyFullscreenCloneStyle, createZoomClone } from './zoomClone.js';

const COVER_FADE_TRANSITION = 'opacity 1s ease-out';

// Shrinks the fullscreen clone back to its original card position.
export function zoomOut(clone, originalRect, sectionClass, onComplete = null, options = {}) {
    const { animateOriginal = true } = options;

    // Legacy in-page zoom-out: restore poster view on the real card.
    // Return-flow dezoom animates the clone instead, so the hidden original
    // must stay in its final grid state and not restart a fade when revealed.
    if (animateOriginal) {
        const boxCoverElement = document.querySelector(`.${sectionClass} .box-cover`);
        if (boxCoverElement) {
            boxCoverElement.classList.remove('fade-out');
            boxCoverElement.classList.add('fade-in');
        }

        const boxDataElement = document.querySelector(`.${sectionClass} .box-data`);
        if (boxDataElement) {
            boxDataElement.classList.remove('fade-in');
            boxDataElement.classList.add('fade-out');
        }
    }

    animateCloneToRect(clone, originalRect, onComplete);
}

// Prepares the clone in the same visual state as the end of zoom-in.
function prepareCloneForDezoom(clone) {
    const cover = clone.querySelector('.box-cover');
    const data = clone.querySelector('.box-data');

    [cover, data].forEach((element) => {
        if (!element) {
            return;
        }
        element.classList.remove('fade-in', 'fade-out');
        element.style.animation = 'none';
        element.style.transition = 'none';
        element.style.visibility = 'visible';
    });

    if (cover) {
        cover.style.opacity = '0';
    }

    if (data) {
        data.style.opacity = '1';
    }
}

// Reverse of zoom-in: poster fades in while the clone shrinks.
function playCloneDezoomFades(clone) {
    const cover = clone.querySelector('.box-cover');
    const data = clone.querySelector('.box-data');

    if (cover) {
        cover.style.transition = COVER_FADE_TRANSITION;
        cover.style.opacity = '1';
    }

    if (data) {
        data.style.transition = COVER_FADE_TRANSITION;
        data.style.opacity = '0';
    }
}

// Resolves once the poster image is decoded so it can fade in during dezoom.
function waitForImage(img, timeoutMs = 200) {
    if (!img) {
        return Promise.resolve();
    }

    const decoded = typeof img.decode === 'function'
        ? img.decode().catch(() => undefined)
        : img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
            });

    return Promise.race([
        decoded,
        new Promise((resolve) => {
            window.setTimeout(resolve, timeoutMs);
        })
    ]);
}

// Replays the reverse transition when returning from a section page.
export function dezoomFromFullscreen(sectionClass) {
    const box = document.querySelector(`.box.${sectionClass}`);
    if (!box) {
        return;
    }

    const boxRect = box.getBoundingClientRect();
    const clone = createZoomClone(box, boxRect);
    applyFullscreenCloneStyle(clone);
    clone.style.pointerEvents = 'none';

    prepareCloneForDezoom(clone);

    box.style.visibility = 'hidden';
    document.body.appendChild(clone);

    const startDezoom = () => {
        clone.offsetHeight;
        requestAnimationFrame(() => {
            playCloneDezoomFades(clone);
            zoomOut(clone, boxRect, sectionClass, () => {
                box.style.visibility = 'visible';
            }, { animateOriginal: false });
        });
    };

    waitForImage(clone.querySelector('.box-image')).then(startDezoom);
}
