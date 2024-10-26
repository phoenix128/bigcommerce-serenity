document.addEventListener('alpine:init', () => {
    Alpine.data('serenityGiftWrapForm', (options = {}) => ({
        isSingleGiftWrap: options.isSingleGiftWrap ?? true,
        wrappings: options.wrappings ?? [],
        giftWrapMode: 'same',
        isGiftWrapSubmitting: false,

        init() {
            this.$watch('giftWrapMode', value => {
                this.isSingleGiftWrap = value === 'same';
            });
        },

        giftWrapForm: {
            '@submit'() {
                this.isGiftWrapSubmitting = true;
            },
        },

        giftWrapSubmitButton: {
            ':disabled': 'isGiftWrapSubmitting',
        },
    }));

    Alpine.data('serenityGiftWrapItemDetail', (options = {}) => ({
        selectedWrapping: '',
        hasMessage: false,
        previewImageUrl: undefined,
        previewImageZoomUrl: undefined,
        previewImageAlt: undefined,
        imagePreviewSize: options.imagePreviewSize ?? '256x256',

        init() {
            const selectedWrapping = this.wrappings.find(wrapping => wrapping.selected);
            this.selectedWrapping = selectedWrapping ? selectedWrapping.id : '';

            if (selectedWrapping?.id) {
                this.onWrappingChange(selectedWrapping.id);
            }

            this.$watch('selectedWrapping', (v) => this.onWrappingChange(v));
        },

        onWrappingChange(value) {
            const wrapping = this.wrappings.find(wrapping => wrapping.id === parseInt(value, 10));

            this.hasMessage = wrapping?.allow_message ?? false;
            this.previewImageUrl = wrapping?.preview_image.data.replace('{:size}', '256x256') ?? '';
            this.previewImageZoomUrl = wrapping?.preview_image.data.replace('{:size}', 'original') ?? '';
            this.previewImageAlt = wrapping?.preview_image.alt ?? '';
        },
    }));
});