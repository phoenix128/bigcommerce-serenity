import Alpine from 'alpinejs';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityNavigation', (options = {}) => ({
        path: options.path || '',
        isSticky: false,

        init() {
            const nav = this.$el;
            const handleScroll = () => {
                const navTop = nav.getBoundingClientRect().top + window.scrollY;
                this.isSticky = window.scrollY >= navTop;
            };

            window.addEventListener('scroll', handleScroll);
        },
    }));

    Alpine.data('serenityNavigationItem', (options = {}) => ({
        isActive: false,
        isOpen: false,
        url: options.url || '',

        init() {
            this.isActive = this.path.startsWith(this.url);
            Alpine.bind(this.$el, this.el);
        },

        el: {
            '@click'() {
                this.toggle();
            },
        },

        childrenMenu: {
            'x-show': 'isOpen',
            'x-ref': 'childrenMenu',
            'x-transition': options.transition ?? true,
            '@click.away'() {
                this.close();
            },
            '@keydown.escape'() {
                this.close();
            },
        },

        canOpen() {
            return this.$refs.childrenMenu;
        },

        toggle() {
            if (!this.canOpen()) return;
            this.isOpen = !this.isOpen;
        },

        close() {
            if (!this.canOpen()) return;
            this.isOpen = false;
        },

        open() {
            if (!this.canOpen()) return;
            this.isOpen = true;
        },
    }));
});
