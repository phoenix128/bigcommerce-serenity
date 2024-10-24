import utils from '@bigcommerce/stencil-utils';
import navigate from '../utils/navigate';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityQuickSearch', (options = {}) => ({
        resultsHtml: null,
        isLoading: false,

        input: {
            '@input.debounce.500ms'(evt) {
                this.quickSearch(evt.target.value);
            },
            '@keydown.enter'(evt) {
                this.search(evt.target.value);
            },
            '@keydown.escape'() {
                this.clearSearch();
            },
            'x-ref': 'input',
        },

        results: {
            'x-show'() {
                return this.resultsHtml !== null;
            },
            'x-html'() {
                return this.resultsHtml;
            },
        },

        loading: {
            'x-show': 'isLoading',
        },

        clearButton: {
            '@click'() {
                this.clearSearch();
            },
        },

        clearSearch() {
            this.resultsHtml = null;
            this.$refs.input.value = '';
        },

        quickSearch(searchQueryIn) {
            const searchQuery = searchQueryIn.trim();

            if (!searchQuery) {
                this.resultsHtml = null;
                return false;
            }

            const template = options.template || 'search/quick-results';

            this.isLoading = true;
            utils.api.search.search(searchQuery, { template }, (err, response) => {
                if (err) {
                    this.resultsHtml = null;
                    this.isLoading = false;
                    return false;
                }

                this.isLoading = false;
                this.resultsHtml = response;
            });
        },

        search(searchQueryIn) {
            const searchQuery = searchQueryIn.trim();

            navigate(`${options.searchUrl}?search_query=${encodeURIComponent(searchQuery)}`);
        },
    }));
});
