import { api } from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityProductList', (options = {}) => ({
        requestOptions: {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: options.categoryProductsPerPage, // See init() method
                    },
                },
            },
            template: {
                productListing: options.productListingTemplate ?? 'category/product-listing',
                facetSidebar: options.facetSidebarTemplate ?? 'category/sidebar',
            },
        },

        productListing: {
            'x-ref': 'productListing',
        },

        facetSidebar: {
            'x-ref': 'facetSidebar',
        },

        init() {
            this.$nextTick(() => {
                const context = Alpine.store('context');
                this.requestOptions.config.category.products.limit = options.categoryProductsPerPage ?? context.categoryProductsPerPage;
            });
        },

        reloadProductListing(url) {
            api.getPage(url, this.requestOptions, (err, content) => {
                if (err) {
                    Swal.fire({
                        title: err.message,
                        icon: 'error',
                    });
                    throw new Error(err);
                }

                const productListing = this.$refs.productListing;
                const facetSidebar = this.$refs.facetSidebar;

                if (productListing) {
                    productListing.innerHTML = content.productListing;
                }

                if (facetSidebar) {
                    facetSidebar.innerHTML = content.facetSidebar;
                }

                window.history.pushState({}, document.title, url);
            });
        },
    }));
});