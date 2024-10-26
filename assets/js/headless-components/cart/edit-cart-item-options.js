import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityEditCartItemOptions', (options = {}) => ({
        itemId: options.itemId,
        productId: options.productId,

        editCartItemOptionsButton: {
            '@click'(evt) {
                evt.preventDefault();
                this.editCartItemOptions();
            },
        },

        getModal() {
            const res = Alpine.store('serenityModal');
            if (!res) {
                throw new Error('serenityModal not found');
            }
            return res;
        },

        editCartItemOptions() {
            if (!this.itemId) return;
            this.getModal().openLoading();

            const options = {
                template: 'cart/modals/configure-product',
            };

            utils.api.productAttributes.configureInCart(this.itemId, options, (err, response) => {
                if (err) {
                    Swal.fire({
                        title: err.message,
                        icon: 'error',
                    }).then();
                    this.getModal().close();
                    return;
                }

                this.getModal().openContent(response.content, true);

                this.$nextTick(() => {
                    this.bindOptionsForm(this.productId, this.itemId);
                });
            });
        },

        bindOptionsForm(productId, itemId) {
            // This is not actually necessary, but serenityProductOptions is expecting a productId to be set
            const productOptions = Alpine.$data(document.querySelector('[x-data="serenityProductOptions"]'));
            if (!productOptions) {
                throw new Error('serenityProductOptions not found');
            }


            productOptions.productId = productId;
        },
    }));
});