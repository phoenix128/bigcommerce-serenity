document.addEventListener('alpine:init', () => {
    Alpine.data('serenitySubscribeForm', (options = {}) => ({
        isSubscribing: false,

        subscribeForm: {
            '@submit'() {
                this.isSubscribing = true;
            }
        },

        subscribeFormSubmit: {
            ':disabled': 'isSubscribing',
            ':class': '{ "opacity-50 cursor-progress": isSubscribing }'
        }
    }));
});