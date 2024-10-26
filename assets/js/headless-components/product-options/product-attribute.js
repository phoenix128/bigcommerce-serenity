document.addEventListener('alpine:init', () => {
    Alpine.data('serenityProductAttribute', (options = {}) => ({
        attributeId: options.id,
        autoUpdate: options.autoUpdate ?? true,

        isModifier() {
            return this.availableModifiers?.includes(parseInt(this.$el.value, 10));
        },

        // Select
        attributeInput: {
            '@input'() {
                if (this.autoUpdate) {
                    this.updateOptions();
                }
            },
        },
    }));
});
