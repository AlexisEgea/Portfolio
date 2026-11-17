import { playHomeEntryAnimation } from '../features/home/playHomeEntryAnimation.js';
import { bindDesktopGate } from '../features/layout/desktopGate.js';
import { bindZoomNavigation, restoreFromReturnFlow } from '../features/navigation/zoomNavigation.js';
import { applyStoredTheme } from '../features/theme/applyTheme.js';

applyStoredTheme();

// Home page entrypoint: restore return flow or run initial home setup.
document.addEventListener('DOMContentLoaded', () => {
    bindDesktopGate();

    // If coming back from a section page, only replay the dezoom flow.
    const handledReturnFlow = restoreFromReturnFlow();
    if (handledReturnFlow) {
        // Keep navigation active after dezoom without replaying home entry animation.
        bindZoomNavigation();
        return;
    }

    // Standard first load flow for the main grid.
    bindZoomNavigation();
    playHomeEntryAnimation();
});
