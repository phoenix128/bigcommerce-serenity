document.addEventListener('alpine:init', () => {
    Alpine.data('serenityEditCartItemOptionsForm', (options = {}) => ({
        isCartItemOptionsSubmitting: false,

        editCartItemOptionsForm: {
            '@submit'() {
                this.isCartItemOptionsSubmitting = true;
            },
        },
    }));
});