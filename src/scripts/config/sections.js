// Section IDs that expose textual content inside the main grid cards.
export const CONTENT_SECTION_IDS = [
    'hard-skills',
    'soft-skills',
    'education',
    'introduction',
    'certification',
    'settings',
    'work-experience',
    'personal-project'
];

// Mapping from a card section class to its dedicated page path.
export const SECTION_PAGE_MAP = {
    'soft-skills': 'src/pages/soft-skills.html',
    'hard-skills': 'src/pages/hard-skills.html',
    'education': 'src/pages/education.html',
    'introduction': 'src/pages/introduction.html',
    'certification': 'src/pages/certification.html',
    'settings': 'src/pages/settings.html',
    'work-experience': 'src/pages/work-experience.html',
    'personal-project': 'src/pages/personal-project.html'
};

// Per-card animation styles used during the initial home grid reveal.
export const HOME_ENTRY_ANIMATIONS = {
    'presentation': {
        enter: { opacity: '0', transform: 'translateX(-70px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateX(0)' }
    },
    'soft-skills': {
        enter: { opacity: '0', transform: 'translateY(-20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateY(0)' }
    },
    'hard-skills': {
        enter: { opacity: '0', transform: 'translateX(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateX(0)' }
    },
    'education': {
        enter: { opacity: '0', transform: 'translateY(-20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateY(0)' }
    },
    'certification': {
        enter: { opacity: '0', transform: 'translateX(70px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateX(0)' }
    },
    'settings': {
        enter: { opacity: '0', transform: 'translateY(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateY(0)' }
    },
    'personal-project': {
        enter: { opacity: '0', transform: 'translateX(70px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateX(0)' }
    },
    'work-experience': {
        enter: { opacity: '0', transform: 'translateY(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateY(0)' }
    },
    'resume': {
        enter: { opacity: '0', transform: 'translateX(-70px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateX(0)' }
    },
    'mail': {
        enter: { opacity: '0', transform: 'translateY(70px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateY(0)' }
    },
    'linkedin': {
        enter: { opacity: '0', transform: 'translateX(-70px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateX(0)' }
    },
    'github': {
        enter: { opacity: '0', transform: 'translateY(-70px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'translateY(0)' }
    },
    'introduction': {
        enter: { opacity: '0', transform: 'scale(1.5)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' },
        final: { opacity: '1', transform: 'scale(1)' }
    }
};

// Fixed reveal order for the home grid cards.
export const HOME_ENTRY_ANIMATION_ORDER = [
    'introduction',
    'github',
    'personal-project',
    'education',
    'presentation',
    'work-experience',
    'mail',
    'hard-skills',
    'certification',
    'linkedin',
    'soft-skills',
    'resume',
    'settings'
];
