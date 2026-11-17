import { bindDesktopGate } from '../features/layout/desktopGate.js';
import { initSectionContentPage } from '../features/section/sectionContentPage.js';
import { applyStoredTheme } from '../features/theme/applyTheme.js';

applyStoredTheme();

// Section page entrypoint: load section content and return behavior.
document.addEventListener('DOMContentLoaded', () => {
    bindDesktopGate();
    initSectionContentPage();
});
