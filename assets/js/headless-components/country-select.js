import { Alpine } from "alpinejs";
import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Swal from 'sweetalert2';

document.addEventListener('alpine:init', () => {
    Alpine.data('serenityCountrySelect', (options = {}) => ({
        countryFieldSelector: options.countryFieldSelector || '[data-field-type=Country]',
        stateFieldSelector: options.stateFieldSelector || '[data-field-type=State]',
        stateWrapperSelector: options.stateWrapperSelector || '[data-type=State]',
        states: [],
        isStateDropdown: false,

        init() {
            const countryElement = document.querySelector(this.countryFieldSelector);
            const stateElement = document.querySelector(this.stateFieldSelector);
            const stateWrapperElement = document.querySelector(this.stateWrapperSelector);

            Alpine.bind(countryElement, this.countryField);
            Alpine.bind(stateElement, this.stateField);
            Alpine.bind(stateWrapperElement, this.stateWrapper);

            if (stateElement) {
                const requiredLabel = document.querySelector(`label[for="${stateElement.id}"] .required`);
                Alpine.bind(requiredLabel, this.requiredStateLabel);
            }

            if (stateWrapperElement) {               
                this.stateWrapperElementValidation = JSON.parse(stateWrapperElement.getAttribute('data-validation'));
            }

            this.$nextTick(() => {
                this.onCountryChange(countryElement.value);
            });
        },

        countryField: {
            '@change'(evt) {
                this.onCountryChange(evt.target.value);
            },
            'x-ref': 'countryField'
        },

        stateWrapper: {
            'x-ref': 'stateWrapper'
        },

        stateField: {
            'x-ref': 'stateField',
            ':required'() {
                return this.isStateDropdown;
            }
        },

        requiredStateLabel: {
            'x-show': 'isStateDropdown'
        },

        onCountryChange(countryName) {
            if (!countryName) {
                this.states = [];
                this.updateStateField();
                return;
            }

            utils.api.country.getByName(countryName, (err, response) => {
                if (err) {
                    const stateRetrieveError = Alpine.store('context').state_error;

                    Swal.fire({
                        title: stateRetrieveError,
                        icon: 'error',
                    }).then();

                    throw err;
                }
    
                this.states = response.data.states;
                this.updateStateField();
            });
        },

        copyFieldAttributes(source, target) {
            const sourceAttributes = source.attributes;
            for (let i = 0; i < sourceAttributes.length; i++) {
                target.setAttribute(sourceAttributes[i].name, sourceAttributes[i].value);
            }
        },

        updateStateField() {
            const stateFieldElement = this.$refs.stateField;
            if (!stateFieldElement) {
                return;
            }

            // SWAP input field with select dropdown
            if (this.states.length > 0) {
                if (stateFieldElement.tagName === 'INPUT') {
                    const select = document.createElement('select');
                    this.copyFieldAttributes(stateFieldElement, select);
                    select.className = 'select';

                    const defaultOption = document.createElement('option');
                    defaultOption.text = 'Choose a state';
                    defaultOption.value = '';
                    select.appendChild(defaultOption);

                    this.states.forEach(state => {
                        const option = document.createElement('option');
                        option.value = state.id;
                        option.text = state.name;
                        select.appendChild(option);
                    });

                    select.setAttribute('x-ref', 'stateField');
                    stateFieldElement.parentNode.replaceChild(select, stateFieldElement);

                    this.$refs.stateField = select;

                    Alpine.bind(select, this.stateField);
                }
            } else {
                if (stateFieldElement.tagName === 'SELECT') {
                    const input = document.createElement('input');
                    this.copyFieldAttributes(stateFieldElement, input);
                    input.type = 'text';
                    input.className = 'input';
                    input.setAttribute('x-ref', 'stateField');

                    stateFieldElement.parentNode.replaceChild(input, stateFieldElement);
                    
                    this.$refs.stateField = input;
                    Alpine.bind(input, this.stateField);
                }
            }

            this.isStateDropdown = this.states.length > 0;

            this.$refs.stateWrapper.setAttribute(
                'data-validation',
                JSON.stringify({
                    ...this.stateWrapperElementValidation,
                    required: this.states.length > 0
                })
            );

            window.dispatchEvent(new CustomEvent('serenityCountrySelect', {
                detail: {
                    code: 'update',
                },
            }));
        }
    }));
});