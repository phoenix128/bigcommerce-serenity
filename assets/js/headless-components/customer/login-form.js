import { Alpine } from "alpinejs";
import JustValidate from "just-validate";

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityLoginForm', (options = {}) => ({
        validator: null,
        isSubmitting: false,

        init() {
            this.$nextTick(() => {
                this.applyValidation();
            });
        },

        email: {
            'x-ref': 'emailField',
            ':disabled': 'isSubmitting'
        },

        emailErrorsContainer: {
            'x-ref': 'emailErrorsContainer'
        },

        password: {
            'x-ref': 'passwordField',
            ':disabled': 'isSubmitting'
        },

        passwordErrorsContainer: {
            'x-ref': 'passwordErrorsContainer'
        },

        submit: {
            'x-ref': 'submitButton',
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }'
        },

        applyValidation() {
            const context = Alpine.store('context');

            const validator = new JustValidate(this.$el);
            validator.addField(
                this.$refs.emailField,
                [
                    {
                        rule: 'required',
                        errorMessage: 'Email is required'
                    },
                    {
                        rule: 'email',
                        errorMessage: context.useValidEmail
                    }
                ],
                {
                    errorsContainer: this.$refs.emailErrorsContainer
                }
            );

            validator.addField(
                this.$refs.passwordField,
                [
                    {
                        rule: 'required',
                        errorMessage: context.enterPass
                    }
                ],
                {
                    errorsContainer: this.$refs.passwordErrorsContainer
                }
            );

            validator.onSuccess((evt) => {
                window.setTimeout(() => {
                    evt.target.submit();

                    // Make sure isSubmitting is set after the form is submitted or the disabled fields will not be submitted
                    this.isSubmitting = true; 
                }, 200); // Make sure the csrf token is set by waiting a bit
            });

            this.validator = validator;
        }
    }));
});