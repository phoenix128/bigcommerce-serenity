document.addEventListener('alpine:init', () => {
    Alpine.data('serenityFlexCarousel', (options = {}) => ({
        slides: [],
        startX: 0,
        scrollLeft: 0,
        isDragging: false,
        isAtStart: true,
        isAtEnd: false,
        slideWidth: 0,
        hasNavigation: false,

        slide: {
            'data-slide': true,
        },

        carouselWrapper: {
            'x-ref': 'carouselWrapper',
            '@touchstart.passive'(evt) {
                this.handleTouchStart(evt);
            },
            '@touchmove.passive'(evt) {
                this.handleTouchMove(evt);
            },
            '@touchend.passive'() {
                this.handleTouchEnd();
            },
            '@mousedown'(evt) {
                this.handleMouseDown(evt);
            },
            '@mousemove'(evt) {
                this.handleMouseMove(evt);
            },
            '@mouseleave.passive'() {
                this.handleMouseLeave();
            },
            '@mouseup'() {
                this.handleMouseUp();
            },
            '@scroll.passive'() {
                this.checkScroll();
            },
            ':class'() {
                return this.isDragging ? 'cursor-grab' : 'snap-x snap-mandatory scroll-smooth';
            },
        },

        scrollLeftButton: {
            '@click'() {
                this.moveLeft();
            },
            ':disabled'() {
                return this.isAtStart;
            },
        },

        scrollRightButton: {
            '@click'() {
                this.moveRight();
            },
            ':disabled'() {
                return this.isAtEnd;
            },
        },

        init() {
            this.$nextTick(() => {
                this.start();
                setTimeout(() => {
                    this.start();
                }, 50);

                window.addEventListener('resize', () => {
                    this.start();
                });
            });
        },

        start() {
            this.slides = this.$el.querySelectorAll('[data-slide]');
            if (this.slides.length > 0) {
                this.slideWidth = this.slides[0].offsetWidth + parseInt(getComputedStyle(this.slides[0]).marginRight);
            }

            this.hasNavigation = this.$refs.carouselWrapper.scrollWidth > this.$refs.carouselWrapper.clientWidth;
            this.checkScroll();
        },

        handleTouchStart(evt) {
            if (evt.touches.length > 1) return;

            this.isDragging = true;
            this.startX = evt.touches[0].pageX - this.$refs.carouselWrapper.offsetLeft;
            this.scrollLeft = this.$refs.carouselWrapper.scrollLeft;
        },

        handleTouchMove(evt) {
            if (!this.isDragging) return;
            const x = evt.touches[0].pageX - this.$refs.carouselWrapper.offsetLeft;
            const walk = (this.startX - x);
            this.$refs.carouselWrapper.scrollLeft = this.scrollLeft + walk;
        },

        handleTouchEnd() {
            this.isDragging = false;
        },

        handleMouseDown(evt) {
            evt.preventDefault();
            this.isDragging = true;
            this.startX = evt.pageX - this.$refs.carouselWrapper.offsetLeft;
            this.scrollLeft = this.$refs.carouselWrapper.scrollLeft;
            this.$refs.carouselWrapper.classList.add('cursor-grabbing');
            this.$refs.carouselWrapper.classList.remove('cursor-grab');
        },

        handleMouseMove(evt) {
            if (!this.isDragging) return;
            evt.preventDefault();
            const x = evt.pageX - this.$refs.carouselWrapper.offsetLeft;
            const walk = (this.startX - x);
            this.$refs.carouselWrapper.scrollLeft = this.scrollLeft + walk;
        },

        handleMouseLeave() {
            this.isDragging = false;
            this.$refs.carouselWrapper.classList.remove('cursor-grabbing');
            this.$refs.carouselWrapper.classList.add('cursor-grab');
        },

        handleMouseUp() {
            this.isDragging = false;
            this.$refs.carouselWrapper.classList.remove('cursor-grabbing');
            this.$refs.carouselWrapper.classList.add('cursor-grab');
        },

        moveLeft() {
            this.$refs.carouselWrapper.scrollBy({
                left: -this.slideWidth,
                behavior: 'smooth',
            });
        },

        moveRight() {
            this.$refs.carouselWrapper.scrollBy({
                left: this.slideWidth,
                behavior: 'smooth',
            });
        },

        checkScroll() {
            const scrollLeft = this.$refs.carouselWrapper.scrollLeft;
            const maxScrollLeft = this.$refs.carouselWrapper.scrollWidth - this.$refs.carouselWrapper.clientWidth;

            this.isAtStart = scrollLeft <= 0;
            this.isAtEnd = scrollLeft >= maxScrollLeft - 1;
        },
    }));
});
