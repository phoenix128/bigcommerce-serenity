import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityAddCouponForm', (options = {}) => ({
        couponCode: '',
        isOpen: false,
        isSubmitting: false,

        addCouponForm: {
            'x-ref': 'addCouponForm',
            '@submit.prevent': 'submitCoupon'
        },

        couponCodeInput: {
            'x-model': 'couponCode',
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }'
        },

        addCouponToggleButton: {
            '@click'() {
                this.isOpen = !this.isOpen;
            }
        },

        couponCodeSubmitButton: {
            ':disabled': 'isSubmitting',
            ':class': '{ "opacity-50 cursor-progress": isSubmitting }'
        },

        submitCoupon() {
            this.isSubmitting = true;
            utils.api.cart.applyCode(this.couponCode, (err, response) => {
                if (err) {
                    this.isSubmitting = false;
                    Swal.fire({
                        title: err.message,
                        icon: 'error',
                    }).then();
                    return;
                }

                console.log(response);

                if (response.data.status === 'success') {
                    window.location.reload();
                } else {
                    this.isSubmitting = false;
                    Swal.fire({
                        title: response.data.errors.join('\n'),
                        icon: 'error',
                    }).then();
                }
            });
        }
    }));
});