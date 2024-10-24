const { info } = require('autoprefixer');
const { fontFamily, fontSize } = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./templates/**/*.html', './assets/js/**/*.js', './assets/css/**/*.css'],
    theme: {
        fontSize: () => {
            const factor = 0.8; // Reduce the default font size by 20%
            const newFontSize = {};

            Object.keys(fontSize).forEach((key) => {
                const [size, lineHeight] = fontSize[key];
                newFontSize[key] = [
                    `${parseFloat(size) * factor}rem`,
                    lineHeight ? `${parseFloat(lineHeight) * factor}rem` : lineHeight,
                ];
            });

            return newFontSize;
        },
        extend: {
            screens: { // Use only screen max notation
                fhd: { min: '1920px' },
                '2k': { min: '2560px' },
                '4k': { min: '3840px' }
            },
            spacing: {
                114: '28rem',
                118: '29rem',
                128: '32rem',
                144: '36rem',
                160: '40rem',
                192: '48rem',
                224: '56rem',
                256: '64rem',
                'screen-xs': '320px',
                'screen-sm': '575px',
                'screen-md': '768px',
                'screen-lg': '1024px',
                'screen-xl': '1280px',
                'screen-2xl': '1536px',
                'screen-fhd': '1920px',
                'screen-2k': '2560px',
                'screen-4k': '3840px',
            },
            aspectRatio: {
                portrait: '9 / 16',
                wide: '16 / 10',
                panoramic: '21 / 9',
                'wide-portrait': '10 / 16',
                'ultra-wide': '32 / 9',
                'crt-portrait': '3 / 4',
                crt: '4 / 3'
            },
            textColor: {
                primary: '#333',
                'primary-light': '#666',
                secondary: '#666',
                inverted: '#ccc',
                price: 'rgb(0, 111, 238)',
                'non-sale-price': '#777',
                danger: '#ff0000',
            },
            backgroundColor: {
                main: 'white',
                info: '#007bff',
                danger: '#cc0000',
                success: '#009900',
                warning: '#ff9900',
                primary: '#eee',
                secondary: '#ddd',
                inverted: 'rgb(31, 41, 55)',
            },
            borderColor: {
                divider: '#eee',
            },
            keyframes: {
                'slide-in': {
                    '0%': { opacity: '0', transform: 'translateY(200px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'slide-in': 'slide-in 1.5s both',
                'slide-in-quick': 'slide-in .5s both',
            },
        },
    },
};
