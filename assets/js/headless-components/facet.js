import Alpine from 'alpinejs';
import mergeQs from '../utils/merge-qs';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityFacets', (options = {}) => ({
        applyFacets(url) {
            if (!this.reloadProductListing) {
                throw new Error('reloadProductListing method is required');
            }

            this.reloadProductListing(url);
        }
    }));

    Alpine.data('serenityFacetItem', (options = {}) => ({
        isSelected: options.selected ?? false,
        isLoading: false,
        url: options.url ?? '',

        button: {
            'href': '#',
            'data-no-swup': true,

            ':class'() {
                return 'transition-all ' + (this.isLoading ? 'opacity-50 animate-pulse' : 'cursor-pointer');
            },

            ':disabled'() {
                return this.isLoading;
            },

            '@click'(evt) {
                evt.preventDefault();
                if (!this.url) {
                    throw new Error('URL is required');
                }

                this.isLoading = true;
                this.applyFacets(this.url);
            }
        }
    }));

    Alpine.data('serenityFacetForm', (options = {}) => ({
        isSelected: options.selected ?? false,
        isLoading: false,

        form: {
            method: 'get',
            'x-ref': 'form',
        },

        button: {
            ':class'() {
                return 'transition-all ' + (this.isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : 'cursor-pointer');
            },

            ':disabled'() {
                return this.isLoading;
            },

            '@click'(evt) {
                evt.preventDefault();
                const targetUrl = mergeQs(window.location.href, formData);

                this.isLoading = true;
                this.applyFacets(targetUrl);
            }
        }
    }));
});