module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ['dist/**/*.js'],
      env: {},
      extends: [],
      plugins: [],
      rules: {},
    },
    {
      excludedFiles: ['*.test.ts'],
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:n/recommended',
        'plugin:promise/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      files: ['packages/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
      },
      plugins: [
        'import',
        'promise',
        '@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/explicit-member-accessibility': ['error', {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        }],
        '@typescript-eslint/member-delimiter-style': ['error', {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          multilineDetection: 'brackets',
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
        }],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/semi': ['error', 'always'],
        'comma-dangle': 'off',
        'eol-last': ['error', 'always'],
        indent: ['error', 2],
        'max-len': ['error', { code: 120 }],
        'n/no-missing-import': 'off',
        'no-unused-vars': 'off',
        'object-curly-spacing': ['error', 'always'],
        'quote-props': ['error', 'as-needed'],
        quotes: ['error', 'single'],
        semi: 'off',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
          node: true,
          typescript: {
            alwaysTryTypes: true,
            project: [
              'packages/*/tsconfig.json',
            ],
          },
        },
      },
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:n/recommended',
        'plugin:promise/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      files: ['packages/**/*.test.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
      },
      plugins: [
        'import',
        'jest',
        'promise',
        '@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/explicit-member-accessibility': ['error', {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        }],
        '@typescript-eslint/member-delimiter-style': ['error', {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          multilineDetection: 'brackets',
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
        }],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/semi': ['error', 'always'],
        'comma-dangle': 'off',
        'eol-last': ['error', 'always'],
        indent: ['error', 2],
        'max-len': ['error', { code: 120 }],
        'n/no-missing-import': 'off',
        'no-unused-vars': 'off',
        'object-curly-spacing': ['error', 'always'],
        'quote-props': ['error', 'as-needed'],
        quotes: ['error', 'single'],
        semi: 'off',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
          node: true,
          typescript: {
            alwaysTryTypes: true,
            project: [
              'packages/*/tsconfig.json',
            ],
          },
        },
      },
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:n/recommended',
        'plugin:import/recommended',
        'plugin:promise/recommended',
      ],
      files: ['**/*.js'],
      plugins: [
        'import',
        'jest',
        'promise',
      ],
      rules: {
        'comma-dangle': ['error', 'always-multiline'],
        indent: ['error', 2],
        'max-len': ['error', { code: 120 }],
        'n/no-missing-require': 'off',
        'n/no-unpublished-require': 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'object-curly-spacing': ['error', 'always'],
        'quote-props': ['error', 'as-needed'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
      },
    },
  ],
};
