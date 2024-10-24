import mergeQs from '../utils/merge-qs';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityContentSortBox', (options = {}) => ({
        isLoading: false,

        select: {
            '@change'(evt) {
                this.applySorting(evt.target.value);
            },

            ':disabled'() {
                return this.isLoading;
            },

            ':class'() {
                return 'transition-all ' + (this.isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : 'cursor-pointer');
            },
        },

        applySorting(sortCriterion) {
            const url = mergeQs(window.location.href, { sort: sortCriterion });
            this.isLoading = true;
            window.location.href = url;
        }
    }));
});