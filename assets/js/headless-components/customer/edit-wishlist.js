import JustValidate from 'just-validate';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityEditWishlist', (options = {}) => ({
        wishlist: options.wishlist,
        isSubmitting: false,
        validator: null,

        init() {
            this.$nextTick(() => {
                this.applyValidation();
            });
        },

        wishlistForm: {
            'x-ref': 'wishlistForm',
        },

        wishlistName: {
            'x-ref': 'wishlistName',
        },

        submitButton: {
            'x-ref': 'submitButton',
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }',
        },

        applyValidation() {
            const context = Alpine.store('context');

            const validator = new JustValidate(this.$refs.wishlistForm);
            validator.addField(
                this.$refs.wishlistName,
                [
                    {
                        rule: 'required',
                        errorMessage: context.enterWishlistNameError,
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