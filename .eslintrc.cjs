module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json', // Ensure ESLint uses the TypeScript config
  },
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // Allow JSX without needing React in scope (React 17+)
    '@typescript-eslint/no-explicit-any': 'off', // Disable type checking for "any"
  },
  overrides: [
    {
      files: ['*.tsx'], // Apply these rules specifically to .tsx files
      rules: {
        'react/react-in-jsx-scope': 'off', // React doesn't need to be in scope for React 17+
      },
    },
  ],
};
