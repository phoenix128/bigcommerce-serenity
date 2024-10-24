import formValidator from "../../utils/form-validator";

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityCreateAccountForm', (options = {}) => ({
        validator: null,
        isSubmitting: false,

        init() {
            Alpine.bind(this.$el, this.accountForm);

            this.$nextTick(() => {
                this.setupValidator();
                this.enablePasswordStrengthMeter();
            });
        },

        accountForm: {
            'x-ref': 'accountForm',
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
            }
        },

        setupValidator() {
            if (this.validator) {
                this.validator.destroy();
            }

            this.validator = formValidator(this.$refs.accountForm);

            this.validator.onSuccess((evt) => {
                window.setTimeout(() => {
                    evt.target.submit();

                    // Make sure isSubmitting is set after the form is submitted or the disabled fields will not be submitted
                    this.isSubmitting = true; 
                }, 200); // Make sure the csrf token is set by waiting a bit
            });
        },

        enablePasswordStrengthMeter() {
            const passwordField = this.$el.querySelector('[data-type=Password]');
            Alpine.$data(passwordField).passwordStrengthEnabled = true;
        },

        onCountryChange() {
            this.setupValidator();
        },
    }));
});