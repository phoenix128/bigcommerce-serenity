document.addEventListener('alpine:init', () => {
    Alpine.data('serenityCartContent', (options = {}) => ({
        cartContentUpdating: false,
    }));
});
