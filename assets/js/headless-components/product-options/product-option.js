document.addEventListener('alpine:init', () => {
    Alpine.data('serenityProductOption', (options = {}) => ({
        optionId: options.id,
        optionLabelText: options.label,

        optionInput: {
            ':class'() {
                return this.isAvailable() ? 'cursor-pointer' : 'cursor-not-allowed';
            },

            ':disabled'() {
                return !this.isAvailable();
            },

            '@click'(evt) {
                if (!this.isAvailable()) {
                    evt.preventDefault();
                }
            },

            '@input'() {
                if (this.isAvailable() && this.autoUpdate) {
                    this.updateOptions();
                }
            },

            'x-ref': 'optionInput',
        },

        // Swatch & Rectangle
        optionSquareButton: {
            ':class'() {
                const disabledClass = (this.behavior === 'hide_option') ?
                    'hidden' :
                    'cursor-not-allowed product-option-unavailable';

                const enabledClass = this.isSelected() ?
                    'product-option-selected' : 'cursor-pointer';

                return this.isAvailable() ? enabledClass : disabledClass;
            },
        },

        // Select
        optionSelectItem: {
            ':disabled'() {
                return !this.isAvailable();
            },

            ':class'() {
                const disabledClass = (this.behavior === 'hide_option') ?
                    'hidden' :
                    'cursor-not-allowed product-option-unavailable';

                return this.isAvailable() ? '' : disabledClass;
            },

            'x-html'() {
                if (!this.isAvailable()) {
                    return this.optionLabelText + ' (' + this.outOfStockMessage + ')';
                }

                return this.optionLabelText;
            },
        },

        optionLabel: {
            ':disabled'() {
                return !this.isAvailable();
            },

            ':class'() {
                return this.isAvailable() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50';
            },
        },

        isModifier() {
            return this.availableModifiers?.includes(this.optionId);
        },

        isAvailable() {
            return this.isModifier() || !this.inStockAttributes || this.inStockAttributes?.includes(this.optionId);
        },

        isSelected() {
            const inputItemsSet = Array.from(document.querySelectorAll(`input[name="attribute[${this.attributeId}]"]`));
            if (this.inputType() === 'radio') {
                const anyChecked = Array.from(inputItemsSet).some((radio) => radio.checked);

                if (!anyChecked) {
                    return parseInt(inputItemsSet[0]?.value, 10) === this.optionId;
                }
            }

            const checked = Array.from(document.querySelectorAll(`input[name="attribute[${this.attributeId}]"]:checked`));
            const currentOptionChecked = checked.find((input) => parseInt(input.value, 10) === this.optionId);

            return !!currentOptionChecked;
        },

        inputType() {
            return this.$refs.optionInput?.type;
        },
    }));
});
