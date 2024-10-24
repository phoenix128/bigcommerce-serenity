import utils from '@bigcommerce/stencil-utils';
import { normalizeFormData } from '../../utils/api';
import Swal from 'sweetalert2';
import navigate from '../../utils/navigate';

// TODO: The add to cart form is too coupled with the product options component.

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityAddToCartForm', (options = {}) => ({
        addToCartForm: null,
        canBuy: options.canBuy ?? true,
        canPurchase: options.canPurchase ?? true,
        purchasingMessageText: options.purchasingMessageText || '',

        formStrings: {
            message: 'Item added to cart',
            continueShopping: 'Continue Shopping',
            viewCart: 'View Cart',
            ...options.strings
        },

        init() {
            Alpine.bind(this.$el, this.el);
            this.addToCartForm = this.$el;
        },

        el: {
            '@serenityProductOptions.window'(evt) {
                switch (evt.detail.code) {
                    case 'update':
                        this.onProductOptionsUpdate(evt.detail.data);
                        break;
                }
            }
        },

        purchasingMessage: {
            'x-show': '!canBuy',
            'x-transition': true,
        },

        emitEvent(code, data) {
            if (code === 'added') {
                window.dispatchEvent(new CustomEvent('serenityCartUpdate'));
            }

            window.dispatchEvent(new CustomEvent('serenityAddToCartForm', {
                detail: {
                    code,
                    data,
                    form: this.addToCartForm,
                },
            }));
        },

        onProductOptionsUpdate(data) {
            this.canBuy = data.purchasable && data.instock;
            this.canPurchase = data.purchasable;
            this.purchasingMessageText = data.purchasing_message;
        },

        addToCart() {
            if (!this.canBuy || !this.canPurchase) {
                return;
            }

            this.emitEvent('adding', this);
            utils.api.cart.itemAdd(normalizeFormData(new FormData(this.addToCartForm)), (err, response) => {
                if (err) {
                    console.error(err);
                    this.emitEvent('error', err);
                    Swal.fire({
                        title: err.message,
                        icon: 'error',
                    }).then();

                    return;
                }

                this.emitEvent('added', response);

                Swal.fire({
                    title: this.formStrings.message,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: this.formStrings.viewCart,
                    cancelButtonText: this.formStrings.continueShopping,
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/cart.php');
                    }
                });
            });
        }
    }));
});
