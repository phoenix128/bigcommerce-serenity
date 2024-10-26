document.addEventListener('alpine:init', () => {
    Alpine.data('serenityCompare', (options = {}) => ({
        compareUrl: options.compareUrl || '#',
        productsCount: 0,
        productIds: [],

        compareCounter: {
            'x-text': 'productsCount',
        },

        compareLink: {
            ':href'() {
                return this.getCompareUrl();
            },
        },

        init() {
            Alpine.store('compareProducts', this);
        },

        emitEvent(code, data) {
            window.dispatchEvent(new CustomEvent('serenityCompare', {
                detail: {
                    code,
                    data,
                },
            }));

            switch (code) {
            case 'update':
                this.productsCount = data.length;
                break;
            }
        },

        getCompareUrl() {
            return `${this.compareUrl}/${this.productIds.join('/')}`;
        },

        addProduct(product) {
            if (this.productIds.includes(product)) {
                return;
            }
            this.productIds.push(product);
            this.emitEvent('update', this.productIds);
        },

        removeProduct(productId) {
            this.productIds = this.productIds.filter(p => p !== productId);
            this.emitEvent('update', this.productIds);
        },

        clearProducts() {
            this.productIds = [];
            this.emitEvent('update', this.productIds);
        },
    }));
});
