document.addEventListener('alpine:init', () => {
    Alpine.data('serenityPaginator', (options = {}) => ({
        currentPage: options.currentPage || 1,
    }));

    Alpine.data('serenityPaginatorPage', (options = {}) => ({
        isLoading: false,
        isCurrent: false,
        number: options.number || 1,

        init() {
            this.isCurrent = this.number === this.currentPage;
        },

        pageLink: {
            'href': options.url || '#',
            ':class'() {
                if (this.isCurrent) {
                    return;
                }

                return this.isLoading ? 'cursor-progress' : 'cursor-pointer';
            },
            '@click'(evt) {
                if (this.isCurrent) {
                    evt.preventDefault();
                    return;
                }

                this.isLoading = true;
            },
        },
    }));
});
