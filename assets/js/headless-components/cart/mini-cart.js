import utils from '@bigcommerce/stencil-utils';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityMiniCart', (options = {}) => ({
        autoCloseDelay: options.autoCloseDelay ?? 1500,
        productsCount: Alpine.$persist(null).as('productsCount').using(sessionStorage),
        isLoading: false,
        isMiniCartOpen: false,
        cartContent: null,
        outsideMoveTimeout: null,

        init() {
            Alpine.bind(this.$el, this.el);

            this.$nextTick(() => {
                if (this.productsCount === null) {
                    this.updateCartQuantity(false);
                }
            });
        },

        el: {
            '@serenityCartUpdate.window.debounce'(evt) {
                this.updateCartQuantity();
                this.cartContent = null;
            },

            '@serenityCartReset.window.debounce'(evt) {
                this.productsCount = null;
                this.cartContent = null;
            },
        },

        miniCartPreviewButton: {
            'href': '#',
            '@click'(evt) {
                evt.preventDefault();
                this.$nextTick(() => { // Prevent '@click.outside' to be triggered for close
                    this.open();
                });
            },
        },

        miniCartPreviewWrapper: {
            '@mouseover.outside'() {
                this.startAutoCloseTimeout();
            },
            '@mouseover'() {
                this.clearAutoCloseTimeout();
            },
            '@click.outside'() {
                if (this.isMiniCartOpen) {
                    this.close();
                }
            },
            '@keydown.escape'() {
                this.close();
            },
        },

        clearAutoCloseTimeout() {
            if (this.outsideMoveTimeout) {
                clearTimeout(this.outsideMoveTimeout);
                this.outsideMoveTimeout = null;
            }
        },

        startAutoCloseTimeout() {
            if (this.isMiniCartOpen && !this.outsideMoveTimeout) {
                this.outsideMoveTimeout = setTimeout(() => {
                    this.close();
                }, this.autoCloseDelay);
            }
        },

        open() {
            this.loadCartContent();
            this.isMiniCartOpen = true;
        },

        close() {
            this.isMiniCartOpen = false;
            this.clearAutoCloseTimeout();
        },

        updateCartQuantity(showLoading = true) {
            const {
                secureBaseUrl,
                cartId,
            } = Alpine.store('context') ?? {};

            this.productsCount = null;
            if (showLoading) this.isLoading = true;
            utils.api.cart.getCartQuantity({
                baseUrl: secureBaseUrl,
                cartId,
            }, (err, qty) => {
                if (err) {
                    this.isLoading = false;
                    this.productsCount = 0;
                    console.error(err);
                    return;
                }

                this.isLoading = false;
                this.productsCount = qty;
            });
        },

        loadCartContent() {
            const options = {
                template: 'common/cart-preview',
            };

            this.cartContent = null;
            utils.api.cart.getContent(options, (err, response) => {
                this.cartContent = response;
            });
        },
    }));
});