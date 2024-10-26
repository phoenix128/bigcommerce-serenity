import JustValidate from 'just-validate';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityContactUsForm', (options = {}) => ({
        validator: null,
        isSubmitting: false,

        init() {
            this.$nextTick(() => {
                this.applyValidation();
            });
        },

        emailField: {
            'x-ref': 'emailField',
        },

        commentField: {
            'x-ref': 'commentField',
        },

        submit: {
            'x-ref': 'submitButton',
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }',
        },

        applyValidation() {
            const context = Alpine.store('context');

            const validator = new JustValidate(this.$el);
            validator.addField(
                this.$refs.emailField,
                [
                    {
                        rule: 'required',
                        errorMessage: context.contactEmail,
                    },
                    {
                        rule: 'email',
                        errorMessage: context.contactEmail,
                    },
                ],
            );

            validator.addField(
                this.$refs.commentField,
                [
                    {
                        rule: 'required',
                        errorMessage: context.contactQuestion,
                    },
                ],
            );

            validator.onSuccess((evt) => {
                window.setTimeout(() => {
                    evt.target.submit();

                    // Make sure isSubmitting is set after the form is submitted or the disabled fields will not be submitted
                    this.isSubmitting = true;
                }, 200); // Make sure the csrf token is set by waiting a bit
            });

            this.validator = validator;
        },
    }));
});
