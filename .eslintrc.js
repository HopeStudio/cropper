module.exports = {
    extends: ['standard', 'eslint:recommended'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    env: {
        es6: true,
        node: true,
        browser: true,
        mocha: true,
        amd: true,
        jquery: true
    },
    plugins: [
        'standard'
    ],
    global: {
        ENV: true
    },
    rules: {
        semi: [2, 'always'],
        indent: [2, 4, {
            SwitchCase: 1
        }],
        quotes: [2, 'single'],
        'linebreak-style': [2, 'unix'],
        'no-console': [1]
    }
};
