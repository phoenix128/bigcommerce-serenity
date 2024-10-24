const babelParser = require('@babel/eslint-parser');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
    {
        files: ['**/*.js'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-env'],
                },
            },
            globals: {
                ...Object.keys(globals.browser).reduce((acc, key) => {
                    acc[key.trim()] = globals.browser[key];
                    return acc;
                }, {}),
                ...globals.es2021,
                Alpine: true,
            },
        },
        plugins: {
            jest: jestPlugin,
        },
        rules: {
            indent: ['error', 4],
            'no-alert': 'off',
            'consistent-return': 'off',
            'max-len': 'off',
            'import/first': 'off',
            'no-mixed-operators': 'off',
            'class-methods-use-this': 'off',
            'no-template-curly-in-string': 'off',
            'no-underscore-dangle': 'off',
            'prefer-spread': 'off',
            'no-plusplus': 'off',
            'no-restricted-syntax': 'off',
            'no-prototype-builtins': 'off',
            'no-useless-escape': 'off',
            'global-require': 'off',
            'newline-per-chained-call': 'off',
            'arrow-parens': 'off',
            'prefer-destructuring': 'off',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/prefer-default-export': 'off',
            'func-names': 'off',
            ...jestPlugin.configs.recommended.rules,
        },
    },
    {
        ignores: ['assets/js/bundle.js', 'assets/dist/**', 'stencil.conf.js', 'webpack.conf.js'],
    },
];
