document.addEventListener('alpine:init', () => {
    Alpine.data('serenityWriteReview', (options = {}) => ({
        isOpen: options.initialState ?? false,
        ajaxUrl: options.ajaxUrl ?? '',
        isAjax: options.isAjax ?? false,

        init() {
            Alpine.bind(this.$el, this.el);
        },

        content: {
            'x-ref': 'content',
            'x-show': 'false',
        },

        el: {
            '@click'() {
                if (this.isAjax) {
                    window.location.href = this.ajaxUrl;
                    return;
                }

                this.open();
            },
        },

        getModal() {
            const res = Alpine.store('serenityModal');
            if (!res) {
                throw new Error('Modal not found');
            }
            return res;
        },

        open() {
            this.getModal().openContent(this.$refs.content.innerHTML);
        },
    }));
});
