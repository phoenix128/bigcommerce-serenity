document.addEventListener('alpine:init', () => {
    Alpine.data('serenityAddToCartQty', (options = {}) => ({
        qty: options.qty || options.min || 1,
        min: options.min || 1,
        max: options.max || 999999,

        input: {
            'x-ref': 'input',
            'name': 'qty',
            'pattern': '[0-9]+',
            'type': 'text',
            '@input'(evt) {
                const newValue = Number(evt.target.value);
                if (isNaN(newValue)) {
                    evt.target.value = this.qty;
                    return;
                }

                this.qty = Math.min(Math.max(newValue, this.min), this.max);
                evt.target.value = this.qty;
            },
            ':min': 'min',
            ':max': 'max',
            ':value': 'qty',
        },

        decrease: {
            ':class'() {
                return this.canDecrease() ? 'cursor-pointer' : 'cursor-not-allowed';
            },
            ':disabled'() {
                return !this.canDecrease();
            },
            '@click'() {
                if (Number(this.qty) > this.min) {
                    this.qty--;
                }
            },
        },

        increase: {
            ':class'() {
                return this.canIncrease() ? 'cursor-pointer' : 'cursor-not-allowed';
            },
            ':disabled'() {
                return !this.canIncrease();
            },
            '@click'() {
                if (Number(this.qty) < this.max) {
                    this.qty++;
                }
            },
        },

        canIncrease() {
            return Number(this.qty) < this.max;
        },

        canDecrease() {
            return Number(this.qty) > this.min;
        }
    }));
});
