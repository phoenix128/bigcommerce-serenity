import { passwordStrength } from 'check-password-strength'

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityPasswordStrength', (options = {}) => ({
        passwordStrength: undefined,
        password: '',
        colors: {
            0: 'bg-red-800',
            1: 'bg-red-500',
            2: 'bg-yellow-500',
            3: 'bg-green-500',
            ...options.colors
        },
        color: '',
        passwordStrengthEnabled: options.isEnabled ?? true,

        init() {
            this.$watch('password', this.onPasswordChange.bind(this));
        },

        passwordInput: {
            'x-model': 'password'
        },

        passwordStrengthMeter: {
            'x-show': 'passwordStrengthEnabled',
            'x-ref': 'passwordStrengthMeter'
        },

        passwordStrengthText: {
            'x-text'() {
                if (!this.passwordStrength) {
                    return '';
                }

                return this.passwordStrength.value;
            }
        },

        passwordStrengthBar: {
            ':class'() {
                return this.color;
            },
            ':style'() {
                if (!this.passwordStrength) {
                    return 'width: 0';
                }
                return `width: ${(this.passwordStrength.id + 1) * 25}%`;
            }
        },

        onPasswordChange(value) {
            if (!value) {
                this.passwordStrength = undefined;
                this.color = '';
                return;
            }

            this.passwordStrength = passwordStrength(value);
            this.color = this.colors[this.passwordStrength.id];
        }
    }));
});