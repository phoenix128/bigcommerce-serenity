import JustValidate from 'just-validate';
import utils from '@bigcommerce/stencil-utils';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityShippingEstimator', (options = {}) => ({
        validator: null,
        isSubmitting: false,
        shippingQuotesContent: null,
        shippingCountrySelector: options.shippingCountrySelector ?? '[name="shipping-country"]',
        shippingStateSelector: options.shippingStateSelector ?? '[name="shipping-state"]',
        shippingCitySelector: options.shippingCitySelector ?? '[name="shipping-city"]',
        shippingZipSelector: options.shippingZipSelector ?? '[name="shipping-zip"]',
        shippingQuoteId: null,

        init() {
            this.$nextTick(() => {
                this.applyValidation();
            });
        },

        shippingEstimatorForm: {
            'x-ref': 'shippingEstimatorForm',
            '@serenityCountrySelect.window'(evt) {
                switch (evt.detail.code) {
                    case 'update':
                        this.onCountryChange();
                        break;
                }
            },
        },

        shippingEstimatorSubmit: {
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }',
        },

        shippingQuotesForm: {
            'x-ref': 'shippingQuotesForm',
            '@submit.prevent': 'onSubmitShippingQuotesForm',
        },

        shippingQuotes: {
            'x-html': 'shippingQuotesContent',
        },

        onSubmitForm() {
            const form = this.$refs.shippingEstimatorForm;
            const params = {
                country_id: form.querySelector(this.shippingCountrySelector).value,
                state_id: form.querySelector(this.shippingStateSelector).value,
                city: form.querySelector(this.shippingCitySelector).value,
                zip_code: form.querySelector(this.shippingZipSelector).value,
            };

            utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {
                this.isSubmitting = false;
                this.shippingQuotesContent = response.content;
            });
        },

        onSubmitShippingQuotesForm() {
            this.isSubmitting = true;
            utils.api.cart.submitShippingQuote(this.shippingQuoteId, () => {
                window.location.reload();
            });
        },

        onCountryChange() {
            this.applyValidation();
        },

        applyValidation() {
            if (this.validator) {
                this.validator.destroy();
            }

            const form = this.$refs.shippingEstimatorForm;
            const shippingCountryFieldElement = form.querySelector(this.shippingCountrySelector);
            const shippingStateFieldElement = form.querySelector(this.shippingStateSelector);

            const context = Alpine.store('context');
            const validator = new JustValidate(form);

            validator.addField(shippingCountryFieldElement, [
                {
                    rule: 'required',
                    errorMessage: context.shippingCountryErrorMessage,
                },
            ]);

            if (shippingStateFieldElement.tagName === 'SELECT') {
                validator.addField(shippingStateFieldElement, [
                    {
                        rule: 'required',
                        errorMessage: context.shippingProvinceErrorMessage,
                    },
                ]);
            }

            validator.onSuccess((evt) => {
                window.setTimeout(() => {
                    this.onSubmitForm();

                    // Make sure isSubmitting is set after the form is submitted or the disabled fields will not be submitted
                    this.isSubmitting = true;
                }, 200); // Make sure the csrf token is set by waiting a bit
            });

            this.validator = validator;
        },
    }));
});
