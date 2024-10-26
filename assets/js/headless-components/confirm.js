import Swal from 'sweetalert2';
import navigate from '../utils/navigate';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityConfirm', (options = {}) => ({
        submitConfirmMessage: options.message || 'Are you sure you want to proceed?',

        confirmForm: {
            '@submit.prevent'(evt) {
                Swal.fire({
                    title: this.submitConfirmMessage,
                    icon: 'warning',
                    showCancelButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        evt.target.submit();
                    }
                });
            },
        },

        confirmLink: {
            '@click'(evt) {
                evt.preventDefault();

                Swal.fire({
                    title: this.submitConfirmMessage,
                    icon: 'warning',
                    showCancelButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(evt.target.href);
                    }
                });
            },
        },
    }));
});