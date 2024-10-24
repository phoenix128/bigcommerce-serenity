document.addEventListener('alpine:init', () => {
    Alpine.data('serenityEditAccountForm', (options = {}) => ({
        // TODO: Add form validation

        isEditAccountFormSubmitting: false,

        editAccountForm: {
            'x-ref': 'editAccountForm',
            '@submit'() {
                this.isEditAccountFormSubmitting = true;
            }
        },
    }));
});