__webpack_public_path__ = window.__webpack_public_path__;

import '../css/theme.css';
import './headless-components';
import Alpine from 'alpinejs';
import '@sweetalert2/themes/material-ui/material-ui.min.css';
import Swup from 'swup';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupOverlayTheme from '@swup/overlay-theme';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupFormsPlugin from '@swup/forms-plugin';
import persist from '@alpinejs/persist';

/**
 * Initialize Alpine.js
 */
const initializeAlpine = () => {
    window.Alpine = Alpine;
    Alpine.plugin(persist);
    Alpine.start();
};

/**
 * Initialize lazysizes
 */
const initializeLazySizes = () => {
    (async () => {
        window.lazySizesConfig = window.lazySizesConfig || {};
        window.lazySizesConfig.loadMode = 1;
        window.lazySizesConfig.loadHidden = false;

        require('lazysizes');
    })();
};

const initializeFontsLoadingMonitor = () => {
    if (document.fonts) {
        document.fonts.ready.then(function() {
            document.documentElement.classList.add('fonts-loaded');
        });
    }
};

const initializeAppearEffects = () => {
    const onIntersection = (entries, opts) => {
        let delay = 0;

        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                const scrollPosition = window.scrollY;
                const parentAppear = entry.target.parentElement.closest('.appear') ?? entry.target.parentElement.closest('.appear-quick');

                if (parentAppear) {
                    entry.target.classList.remove('appear');
                    entry.target.classList.remove('appear-quick');
                } else {
                    if (entry.target.classList.contains('appear-quick')) {
                        setTimeout(() => {
                            entry.target.classList.add('appear-active-quick');
                        }, scrollPosition === 0 ? delay / 10 : 0);
                    } else {
                        setTimeout(() => {
                            entry.target.classList.add('appear-active');
                        }, scrollPosition === 0 ? delay : 0);
                    }

                    delay += 750;
                }
            }
        });
    };

    const observer = new IntersectionObserver(onIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: .1,
    });

    const appearElements = document.querySelectorAll('[data-widget-id], .appear, .appear-quick');
    if (appearElements.length > 0) {
        appearElements.forEach((appearItem) => {
            observer.observe(appearItem);
        });
    }

    const mutationObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches('[data-widget-id], .appear, .appear-quick')) {
                            observer.observe(node);
                        }

                        const matchingDescendants = node.querySelectorAll('[data-widget-id], .appear, .appear-quick');
                        matchingDescendants.forEach((descendant) => {
                            observer.observe(descendant);
                        });
                    }
                });
            }
        }
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

const initializePageTransitions = () => {
    const swup = new Swup({
        plugins: [
            //new SwupProgressPlugin(),
            new SwupOverlayTheme(),
            new SwupPreloadPlugin(),
            new SwupScrollPlugin(),
            new SwupFormsPlugin(),
        ],
    });

    window.swup = swup;
};

const checkSwupTree = () => {
    const swupCheckBlock = document.querySelector('#swup #swup-check');
    return !!swupCheckBlock;
};

/**
 * This function gets added to the global window and then called
 * on page load with the current template loaded and JS Context passed in
 * @param pageType String
 * @param contextJSON
 * @returns {*}
 */
window.stencilBootstrap = function stencilBootstrap(pageType, contextJSON = null, loadGlobal = true) {
    const context = JSON.parse(contextJSON || '{}');
    window.bcContext = context;

    initializeFontsLoadingMonitor();
    initializePageTransitions();
    initializeAlpine();

    return {
        load() {
            Alpine.store('context', context);

            if (!checkSwupTree()) {
                console.error('Swup tree not found. Make sure you have a #swup element with a #swup-check child element and all HTML tags are correctly closed.');
            }

            initializeLazySizes();
            initializeAppearEffects();
        },
    };
};
