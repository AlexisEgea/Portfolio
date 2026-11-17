import { RETURN_SECTION_KEY } from '../../config/storage.js';
import { fetchSectionContent } from '../../services/contentService.js';
import { playPanelEntryAnimation } from './playPanelEntryAnimation.js';
import { bindPanelExpansion } from './expandPanel.js';
import { PANEL_RENDERERS } from '../../config/panel.js';
import { qs } from '../../shared/dom.js';

const PANEL_INTERACTION_SELECTOR = '.panel, .panel-expand-clone, .panel-expand-overlay, .desktop-gate';

// Binds "click anywhere / Escape" return behavior for section pages.
function bindReturnShortcut(sectionName) {
    const returnToGrid = () => {
        // Persist source section so home page can replay correct dezoom.
        sessionStorage.setItem(RETURN_SECTION_KEY, sectionName);
        window.location.href = `../../index.html?from=${encodeURIComponent(sectionName)}`;
    };

    document.addEventListener('click', (event) => {
        // Ignore clicks on expandable panels so they can open instead of leaving the page.
        if (event.target.closest(PANEL_INTERACTION_SELECTOR)) {
            return;
        }
        returnToGrid();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') {
            return;
        }
        // Let the expander handle Escape while a panel is open.
        if (document.body.classList.contains('is-panel-expanded')) {
            return;
        }
        returnToGrid();
    });
}

// Loads and renders section content, then enables section-specific features.
export async function initSectionContentPage() {
    const root = qs('.section-page');
    if (!root) {
        return;
    }

    // Read section metadata from page root.
    const sectionName = root.dataset.section;
    const contentElement = qs('#section-content');
    if (!sectionName || !contentElement) {
        return;
    }

    bindReturnShortcut(sectionName);

    try {
        const PanelRenderer = PANEL_RENDERERS[sectionName];
        if (PanelRenderer) {
            const renderer = new PanelRenderer(sectionName, contentElement);
            await renderer.render();
            bindPanelExpansion(contentElement);
            playPanelEntryAnimation(contentElement);
            return;
        }

        // Other sections keep the simple text-based rendering.
        contentElement.innerHTML = await fetchSectionContent(sectionName);
    } catch (error) {
        console.error(error);
        contentElement.innerHTML = 'Content unavailable for this section.';
    }
}
