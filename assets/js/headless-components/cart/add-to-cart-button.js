document.addEventListener('alpine:init', () => {
    Alpine.data('serenityAddToCartButton', (options = {}) => ({
        value: options.string || 'Add to Cart',

        strings: options.strings || {
            default: 'Add to Cart',
            adding: 'Adding...',
            added: 'Added!',
        },

        isAdding: false,

        init() {
            Alpine.bind(this.$el, this.el);
        },

        el: {
            ':value': 'value',
            ':disabled'() {
                return this.isAdding || !this.canBuy;
            },
            ':class'() {
                if (!this.canBuy) {
                    return 'cursor-not-allowed';
                }

                return this.isAdding ? 'cursor-progress animate-pulse' : 'cursor-pointer';
            },
            ':title'() {
                if (!this.canBuy) {
                    return this.purchasingMessageText;
                }

                return '';
            },

            '@click'(evt) {
                evt.preventDefault();
                if (!this.addToCart) {
                    throw new Error('Add to cart method not found. Make sure to include the serenityAddToCartForm component.');
                }

                this.addToCart();
            },

            // Listener for serenityAddToCartForm events
            '@serenityAddToCartForm.window'(evt) {
                switch (evt.detail.code) {
                case 'adding':
                    this.onAdding();
                    break;
                case 'added':
                    this.onAdded();
                    break;
                case 'error':
                    this.onError();
                    break;
                }
            },
        },

        onAdded() {
            this.value = this.strings.added;
            setTimeout(() => {
                this.isAdding = false;
                this.value = this.strings.default;
            }, 1000);
        },

        onError() {
            this.isAdding = false;
            this.value = this.strings.default;
        },

        onAdding() {
            this.isAdding = true;
            this.value = this.strings.adding;
        },
    }));
});
