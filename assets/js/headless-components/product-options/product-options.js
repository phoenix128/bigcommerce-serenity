import serialize from 'form-serialize';
import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityProductOptions', (options = {}) => ({
        productId: options.productId || 0,
        inStockAttributes: options.inStockAttributes,
        availableVariants: options.availableVariants,
        availableModifiers: options.availableModifiers,
        price: options.price,
        outOfStockMessage: options.outOfStockMessage || '',
        behavior: options.behavior || 'label_option',
        isLoading: false,

        init() {
            this.$nextTick(() => {
                this.start();
            });
        },

        start() {
            // this.dispatchUpdate(window.BCData.product_attributes);
            this.updateOptions();
        },

        emitEvent(code, data) {
            window.dispatchEvent(new CustomEvent('serenityProductOptions', {
                detail: {
                    code,
                    productId: this.productId,
                    data,
                },
            }));
        },

        updateOptions() {
            // Search the containing form element
            const form = this.$el.closest('form');
            const formData = serialize(form);

            this.isLoading = true;
            utils.api.productAttributes.optionChange(this.productId, formData, (err, result) => {
                const data = result?.data || {};

                if (err) {
                    Swal.fire({
                        title: err.message,
                        icon: 'error',
                    }).then();
                    this.isLoading = false;
                    return;
                }

                this.dispatchUpdate(data);
                this.isLoading = false;
            });
        },

        dispatchUpdate(data) {
            this.inStockAttributes = data.in_stock_attributes;
            this.availableVariants = data.available_variant_values;
            this.availableModifiers = data.available_modifier_values;
            this.outOfStockMessage = data.out_of_stock_message;
            this.behavior = data.out_of_stock_behavior;
            this.price = data.price;

            this.emitEvent('update', data);
        }
    }));
});
