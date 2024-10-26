import formValidator from '../../utils/form-validator';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityEditAddressForm', (options = {}) => ({
        validator: null,
        isSubmitting: false,

        init() {
            Alpine.bind(this.$el, this.addressForm);

            this.$nextTick(() => {
                this.setupValidator();
            });
        },

        addressForm: {
            'x-ref': 'addressForm',
            '@serenityCountrySelect.window'(evt) {
                switch (evt.detail.code) {
                case 'update':
                    this.onCountryChange();
                    break;
                }
            },
        },

        submitButton: {
            'x-ref': 'submitButton',
            ':disabled': 'isSubmitting',
            ':class'() {
                return this.isSubmitting ? 'cursor-not-allowed opacity-50' : '';
            },
        },

        setupValidator() {
            if (this.validator) {
                this.validator.destroy();
            }

            this.validator = formValidator(this.$refs.addressForm);

            this.validator.onSuccess((evt) => {
                window.setTimeout(() => {
                    evt.target.submit();

                    // Make sure isSubmitting is set after the form is submitted or the disabled fields will not be submitted
                    this.isSubmitting = true;
                }, 200); // Make sure the csrf token is set by waiting a bit
            });
        },

        onCountryChange() {
            this.setupValidator();
        },
    }));
});