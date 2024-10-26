import Alpine from 'alpinejs';

Alpine.data('serenityAddToCompare', (options = {}) => ({
    productId: options.productId ?? '',

    addToCompareButton: {
        'href': '#',
        'data-no-swup': true,
        '@click'(evt) {
            evt.preventDefault();
            if (!this.productId) {
                throw new Error('Product ID is required');
            }

            this.addProductToCompare();
        },
    },

    addProductToCompare() {
        const compareStore = Alpine.store('compareProducts');
        if (!compareStore) {
            return;
        }

        compareStore.addProduct(this.productId);
    },
}));

