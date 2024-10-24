import utils from '@bigcommerce/stencil-utils';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityAddGiftWrap', (options = {}) => ({
        itemId: options.itemId || '',

        init() {
            Alpine.bind(this.$el, this.el);
        },

        el: {
            '@click'(evt) {
                evt.preventDefault();
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
            if (!this.itemId) return;
            this.getModal().openLoading();

            const options = {
                template: 'cart/modals/gift-wrapping-form',
            };                

            utils.api.cart.getItemGiftWrappingOptions(this.itemId, options, (err, response) => {
                if (err) {
                    console.error(err);
                    this.getModal().close();
                    return;
                }

                this.getModal().openContent(response.content, true);
            });
        },
    }));
});
