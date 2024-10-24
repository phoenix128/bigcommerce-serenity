import JustValidate from "just-validate";

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityOrderMessageForm', (options = {}) => ({
        validator: null,
        isSubmitting: false,

        init() {
            this.$nextTick(() => {
                this.applyValidation();
            });
        },

        submit: {
            'x-ref': 'submitButton',
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }'
        },

        clear: {
            'x-ref': 'submitButton',
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }'
        },

        orderIdField: {
            'x-ref': 'orderIdField',
            ':disabled': 'isSubmitting',
        },

        messageSubjectField: {
            'x-ref': 'messageSubjectField',
            ':disabled': 'isSubmitting',
        },

        messageContentField: {
            'x-ref': 'messageContentField',
            ':disabled': 'isSubmitting',
        },

        applyValidation() {
            const form = this.$el;
            const context = Alpine.store('context');

            const validator = new JustValidate(form);
            validator.addField(
                this.$refs.orderIdField,
                [
                    {
                        rule: 'required',
                        errorMessage: context.enterOrderNum
                    }
                ]
            );

            validator.addField(
                this.$refs.messageSubjectField,
                [
                    {
                        rule: 'required',
                        errorMessage: context.enterSubject
                    }
                ]
            );

            validator.addField(
                this.$refs.messageContentField,
                [
                    {
                        rule: 'required',
                        errorMessage: context.enterMessage
                    }
                ]
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