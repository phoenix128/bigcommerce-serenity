import navigate from "../../utils/navigate";

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityQuickAddToCartButton', (options = {}) => ({
        productId: options.productId ?? '',
        addToCartUrl: options.addToCartUrl ?? '',

        isAddingToCart: false,

        addToCartButton: {
            'href': '#',
            'data-no-swup': true,
            '@click'(evt) {
                evt.preventDefault();
                this.addToCart();
            },
            ':class'() {
                return this.isAddingToCart ? 'cursor-progress animate-pulse' : 'cursor-pointer';
            },
            ':disabled': 'isAddingToCart'
        },

        addToCart() {
            this.isAddingToCart = true;
            window.dispatchEvent(new CustomEvent('serenityCartReset'));

            if (this.addToCartUrl) {
                navigate(this.addToCartUrl);
                return;
            }

            navigate(`/cart.php?action=add&product_id=${this.productId}`);
        }
    }));
});