document.addEventListener('alpine:init', () => {
    Alpine.data('serenityDropdown', (options = {}) => ({
        isOpen: options.initialState ?? false,
        disableClickAway: options.disableClickAway ?? false,

        init() {},

        button: {
            '@click'(evt) {
                evt.preventDefault();
                this.toggle();
            },
        },

        menu: {
            'x-show': 'isOpen',
            'x-transition': options.transition ?? true,
            '@click.away'() {
                if (!this.disableClickAway) {
                    this.close();
                }
            },
            '@keydown.escape'() {
                this.close();
            },
        },

        open() {
            this.isOpen = true;
        },

        close() {
            this.isOpen = false;
        },

        toggle() {
            this.isOpen = !this.isOpen;
        },
    }));
});
