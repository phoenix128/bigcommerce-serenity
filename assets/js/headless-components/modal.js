document.addEventListener('alpine:init', () => {
    Alpine.data('serenityModal', (options = {}) => ({
        isOpen: options.initialState || false,
        isLoading: false,
        isCompact: false,

        contentHtml: '',

        init() {
            Alpine.bind(this.$el, this.el);
            Alpine.store('serenityModal', this);
        },

        el: {
            'x-transition': options.transition ?? true,
        },

        contentBox: {
            '@click.away'() {
                this.close();
            },
            '@keydown.escape'() {
                this.close();
            },
        },

        clearContent() {
            this.contentHtml = '';
        },

        openContent(html, compact = false) {
            this.isOpen = true;
            this.isLoading = false;
            this.isCompact = compact;
            this.contentHtml = html;
        },

        openLoading() {
            this.isOpen = true;
            this.isLoading = true;
        },

        close() {
            this.isOpen = false;
            this.isLoading = false;
        },
    }));
});
