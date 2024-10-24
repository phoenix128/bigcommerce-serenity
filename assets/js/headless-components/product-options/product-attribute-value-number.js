document.addEventListener('alpine:init', () => {
    Alpine.data('serenityProductAttributeValueNumber', (options = {}) => ({
        min: options.min,
        max: options.max,
        limit: options.limit,
        integerOnly: options.integerOnly ?? true,

        isValid: true,

        attributeInput: {
            '@keyup'(evt) {
                this.isValid = this.isValueValid(evt.target.value);
            },

            '@change'(evt) {
                evt.target.value = this.limitValue(evt.target.value);
                this.isValid = true;
            },
        },

        isValueValid(value) {
            const validValue = this.limitValue(value);
            return String(validValue) === String(value);
        },

        limitValue(value) {
            if (this.integerOnly) {
                value = parseInt(value, 10);
            } else {
                value = parseFloat(value);
            }

            if ((this.limit === 'range' || this.limit === 'lowest') && value < this.min) {
                return this.min;
            }

            if ((this.limit === 'range' || this.limit === 'highest') && value > this.max) {
                return this.max;
            }

            return value;
        }
    }));
});
