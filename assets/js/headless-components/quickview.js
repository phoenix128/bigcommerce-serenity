import utils from '@bigcommerce/stencil-utils';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityQuickView', (options = {}) => ({
        id: options.id || '',

        init() {
            Alpine.bind(this.$el, this.el);
        },

        el: {
            '@click'() {
                this.open();
            },
        },

        getModal() {
            const res = Alpine.store('serenityModal');
            if (!res) {
                throw new Error('serenityModal not found');
            }
            return res;
        },

        open() {
            if (!this.id) return;
            this.getModal().openLoading();

            utils.api.product.getById(this.id, { template: 'products/quick-view' }, (err, response) => {
                if (err) {
                    console.error(err);
                    this.getModal().close();
                    return;
                }

                this.getModal().openContent(response);
            });
        },
    }));
});
