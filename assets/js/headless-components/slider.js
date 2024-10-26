import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../../css/swiper.css';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenitySlider', (options = {}) => ({
        isReady: false,

        init() {
            // Wait for the next tick to ensure the DOM is fully rendered with x-refs
            this.$nextTick(() => {
                this.start();
            });
        },

        main: {
            class: 'swiper',
            'x-ref': 'main',
        },

        wrapper: {
            class: 'swiper-wrapper',
        },

        thumbs: {
            class: 'swiper',
            'x-ref': 'thumbs',
        },

        thumbsWrapper: {
            class: 'swiper-wrapper',
        },

        slide: {
            class: 'swiper-slide',
        },

        thumbsSlide: {
            class: 'swiper-slide swiper-slide-thumb',
        },

        buttonNext: {
            class: 'swiper-button-next',
            'x-ref': 'buttonNext',
        },

        buttonPrev: {
            class: 'swiper-button-prev',
            'x-ref': 'buttonPrev',
        },

        start() {
            const commonOptions = {
                ...options,
                loop: options.loop ?? true,
                spaceBetween: options.spaceBetween ?? 10,
                slidesPerView: options.slidesPerView ?? 1,
                freeMode: options.freeMode ?? false,
                watchSlidesProgress: options.watchSlidesProgress ?? true,
                breakpoints: options.breakpoints ?? {},
            };

            const mainOptions = {
                ...commonOptions,
                modules: [Thumbs, Navigation],
                navigation: {},
            };

            if (this.$refs.buttonNext) {
                mainOptions.navigation.nextEl = this.$refs.buttonNext;
            }

            if (this.$refs.buttonPrev) {
                mainOptions.navigation.prevEl = this.$refs.buttonPrev;
            }

            if (this.$refs.thumbs) {
                const swiperThumbsOptions = {
                    ...commonOptions,
                    slidesPerView: options.thumbsSlider ?? 4,
                    breakpoints: options.thumbsBreakpoints ?? {},
                };

                mainOptions.thumbs = {
                    swiper: new Swiper(this.$refs.thumbs, swiperThumbsOptions),
                };
            }

            new Swiper(this.$refs.main, mainOptions);
            this.isReady = true;
        },
    }));
});
