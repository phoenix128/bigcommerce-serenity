document.addEventListener('alpine:init', () => {
    Alpine.data('serenityProductInformation', (options = {}) => ({
        product: options.product ?? {},

        init() {
            Alpine.bind(this.$el, this.el);
        },

        el: {
            '@serenityProductOptions.window'(evt) {
                switch (evt.detail.code) {
                    case 'update':
                        if (this.product.id && parseInt(evt.detail.productId, 10) === parseInt(this.product.id, 10)) {
                            this.product = {
                                ...this.product,
                                ...evt.detail.data
                            }
                        }
                        
                        break;
                }
            }
        }
    }));
});
