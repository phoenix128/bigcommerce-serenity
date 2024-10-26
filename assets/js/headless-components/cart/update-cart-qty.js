import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';

/**
 * This module must be nested in a parent element with x-data='serenityAddToCartQty'
 */
document.addEventListener('alpine:init', () => {
    Alpine.data('serenityUpdateCartQty', (options = {}) => ({
        itemId: options.itemId,
        timeout: options.timeout ?? 750,
        qty: 1,

        init() {
            // Check if a parent of type serenityAddToCartQty exists
            const parent = this.$el.closest('[x-data^="serenityAddToCartQty"]');
            if (parent) {
                this.qty = Alpine.$data(parent).qty;
            } else {
                throw new Error('Parent element with x-data=\'serenityAddToCartQty\' not found.');
            }

            this.$watch('qty', this.debounce((value) => {
                this.cartContentUpdating = true;
                utils.api.cart.itemUpdate(this.itemId, value, (err, response) => {
                    if (err) {
                        this.cartContentUpdating = false;
                        Swal.fire({
                            title: err.message,
                            icon: 'error',
                        }).then();
                        return;
                    }

                    if (response.data.status === 'succeed') {
                        window.dispatchEvent(new CustomEvent('serenityCartUpdate'));
                        window.location.reload();
                    } else {
                        this.cartContentUpdating = false;
                        Swal.fire({
                            title: response.data.errors.join('\n'),
                            icon: 'error',
                        }).then();
                    }
                });
            }, this.timeout));
        },

        debounce(func, wait) {
            let t;
            return function(...args) {
                const later = () => {
                    clearTimeout(t);
                    func.apply(this, args);
                };
                clearTimeout(t);
                t = setTimeout(later, wait);
            };
        },
    }));
});
