import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';

/**
 * This module must be nested in a parent element with x-data='serenityAddToCartQty'
 */
document.addEventListener('alpine:init', () => {
    Alpine.data('serenityDeleteCartItem', (options = {}) => ({
        itemId: options.itemId,

        deleteCartItemButton: {
            '@click': 'itemRemove',
        },

        itemRemove() {
            this.cartContentUpdating = true;
            utils.api.cart.itemRemove(this.itemId, (err, response) => {
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
        }
    }));
});
