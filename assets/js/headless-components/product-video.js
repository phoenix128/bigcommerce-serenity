document.addEventListener('alpine:init', () => {
    Alpine.data('serenityProductVideo', (options = {}) => ({
        currentVideoId: options.featuredId,

        iframe: {
            ':src'() {
                return `https://www.youtube.com/embed/${this.currentVideoId}?rel=0`;
            },
        },

        openVideoId(videoId) {
            this.currentVideoId = videoId;
        },
    }));

    Alpine.data('serenityProductVideoThumb', (options = {}) => ({
        id: options.id,

        init() {
            Alpine.bind(this.$el, this.el);
        },

        isActive() {
            return this.currentVideoId === this.id;
        },

        el: {
            '@click'() {
                this.openVideoId(this.id);
            },
        },
    }));
});
