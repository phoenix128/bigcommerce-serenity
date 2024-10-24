import Alpine from "alpinejs";

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityTab', (options = {}) => ({
        activeTab: options.activeTab || '',
        tabs: [],
        transition: options.transition ?? true,

        init() {
            Alpine.bind(this.$el, this.el);

            this.$nextTick(() => {
                this.openInitialTab();
            });
        },

        el: {
            'x-show'() {
                return this.tabs.length > 0;
            }
        },

        openInitialTab() {
            if (this.activeTab) {
                this.setActiveTab(this.activeTab);
                return;
            }

            this.setActiveTab(this.tabs[0]);
        },

        setActiveTab(tabCode) {
            this.activeTab = tabCode;
        },

        isActiveTab(tabCode) {
            return this.activeTab === tabCode;
        },
    }));

    Alpine.data('serenityTabButton', (options = {}) => ({
        tabCode: options.code || '',

        init() {
            Alpine.bind(this.$el, this.el);
            this.tabs.push(this.tabCode);
        },

        el: {
            '@click'() {
                this.setActiveTab(this.tabCode);
            },

            ':class'() {
                return this.isActiveTab(this.tabCode) ? 'tab-button-active' : '';
            }
        }
    }));

    Alpine.data('serenityTabContent', (options = {}) => ({
        tabCode: options.code || '',

        init() {
            Alpine.bind(this.$el, this.el);
        },

        el: {            
            'x-show'() {
                return this.isActiveTab(this.tabCode);
            },

            'x-transition'() {
                return this.transition;
            },
        }
    }));
});
