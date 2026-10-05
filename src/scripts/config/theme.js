// Dark tiles sit on black like the iOS keynote grid; light uses white cards on gray.
export const THEME_PRESETS = {
    dark: {
        background: '#000000',
        section: '#2c2c2e',
        panel: '#1c1c1e'
    },
    light: {
        background: '#f2f2f7',
        section: '#ffffff',
        panel: '#ffffff'
    }
};

export const THEME_MODES = ['dark', 'light', 'custom'];
export const THEME_SCHEMA = 2;

export function getDefaultTheme() {
    return {
        mode: 'dark',
        custom: { ...THEME_PRESETS.dark },
        liquidGlass: true,
        schema: THEME_SCHEMA
    };
}
