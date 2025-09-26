import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import eslintParserTs from '@typescript-eslint/parser';

export default [
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/generated/**',
        ],
    },
   {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            parser: eslintParserTs,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': eslintPluginTs,
        },
        rules: {
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
];
