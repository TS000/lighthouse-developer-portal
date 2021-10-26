# [RFC] Linting Rules

**Summary**: Utilize linting to improve code quality.

Integrating linting into our CI process will help enforce uniform standards for code styling which will reduce syntax errors and improve readability.

## Background

Programming languages like C or C++ utilize compilers to catch syntax errors before the code reaches a runtime environment. JavaScript is an interpreted language so it lacks a compilation phase where syntax errors can be identified before the code is ran. Linting software is a form of static code analyzing that can help enforce a set of stylistic rules or check for syntactical errors. Enforcing a single style will also improve the code review process by the need to address styling issues as well as ensure all team members are familiar with the style of the code.


## Goal

Add linting to our CI process by using lerna to call the `backstage-cli` command for each of our Backstage packages and plugins.

## Upgrading from 7.0.0 to 11.0.0

### Updates & changes
- Added `"@backstage/core-components": "^0.6.0",` to `packages/app/package.json` due to
```
$ backstage-cli lint --fix
lerna ERR! yarn run lint --fix exited 1 in 'app'
lerna ERR! yarn run lint --fix stdout:
$ backstage-cli lint --fix


  ✘  https://google.com/#q=import%2Fno-extraneous-dependencies

     '@backstage/core-components' should be listed in the project's dependencies. Run 'npm i -S @backstage/core-components' to add it


     src/components/catalog/EntityPage.tsx:56:1
     54 | } from '@backstage/plugin-org';
     55 | import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
   > 56 | import { EmptyState } from '@backstage/core-components';
        | ^
     57 | 
     58 | const cicdContent = (
     59 |   // This is an example of how you can implement your company's logic in entity page.

✘ 1 problem (1 error, 0 warnings)


Errors:
  1  https://google.com/#q=import%2Fno-extraneous-dependencies
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
lerna ERR! yarn run lint --fix stderr:

Command 'eslint' exited with code 1

error Command failed with exit code 1.
lerna ERR! yarn run lint --fix exited 1 in 'app'
error Command failed with exit code 1.
```
- Added spacing with --fix option due to formatting issues in:
  - `packages/app/src/components/Root/LogoFull.tsx`
  - `packages/app/src/themes/colorTypes.tsx`

### Linting Rules

Backstage utilizes the `backstage-cli lint` command to run the linting process. This check uses the default eslint behavior, and can also check Typescript files, interprets warning as errors, and will default to linting the entire directory if no specific files are listed.

The `backstage-cli lint` command will flag warnings as errors and the linting process with exit with a non-zero code if there any rule violations. This means if we add the linting process to our GitHub actions for CI, then branch protection prevent any code that doesn't meet our standards from being pushed to the `main` branch because the GitHub Action will fail.

Currently we are using the default eslint behavior provided by `@backstage/cli/config/eslint` for the `app package` and `@backstage/cli/config/eslint.backend` for the `backend package`. I added a `.eslintignore` so we can also run `yarn backstage-cli lint` in the root workspace directory for enforcing linting rules outside of the packages/plugins folders.

### Additional Rules
At the moment I don't have any strong opinions towards adding additional linting rules. If anyone else does or if in the future we develop the need for more, we can always add them to our current linting configuration.

## Default eslint Config for App

```
module.exports = {
  extends: [
    '@spotify/eslint-config-base',
    '@spotify/eslint-config-react',
    '@spotify/eslint-config-typescript',
    'prettier',
    'plugin:jest/recommended',
    'plugin:monorepo/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import'],
  env: {
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    lib: require('./tsconfig.json').compilerOptions.lib,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['.eslintrc.js', '**/dist/**', '**/dist-types/**'],
  rules: {
    'no-shadow': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    'no-undef': 'off',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: true,
        peerDependencies: true,
        bundledDependencies: true,
      },
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'no-restricted-imports': [
      2,
      {
        paths: [
          {
            // Importing the entire MUI icons packages kills build performance as the list of icons is huge.
            name: '@material-ui/icons',
            message: "Please import '@material-ui/icons/<Icon>' instead.",
          },
          ...require('module').builtinModules,
        ],
        // Avoid cross-package imports
        patterns: ['**/../../**/*/src/**', '**/../../**/*/src'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        // Default to not enforcing prop-types in typescript
        'react/prop-types': 0,
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
      },
    },
    {
      files: ['*.test.*', '*.stories.*', 'src/setupTests.*', 'dev/**'],
      rules: {
        // Tests are allowed to import dev dependencies
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            optionalDependencies: true,
            peerDependencies: true,
            bundledDependencies: true,
          },
        ],
      },
    },
  ],
};
```
## Default eslint Config for Backend

```
module.exports = {
  extends: [
    '@spotify/eslint-config-base',
    '@spotify/eslint-config-typescript',
    'prettier',
    'plugin:jest/recommended',
    'plugin:monorepo/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import'],
  env: {
    jest: true,
  },
  globals: {
    __non_webpack_require__: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    lib: require('./tsconfig.json').compilerOptions.lib,
  },
  ignorePatterns: ['.eslintrc.js', '**/dist/**', '**/dist-types/**'],
  rules: {
    'no-shadow': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    'no-console': 0, // Permitted in console programs
    'new-cap': ['error', { capIsNew: false }], // Because Express constructs things e.g. like 'const r = express.Router()'
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: true,
        peerDependencies: true,
        bundledDependencies: true,
      },
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
    // Avoid cross-package imports
    'no-restricted-imports': [
      2,
      { patterns: ['**/../../**/*/src/**', '**/../../**/*/src'] },
    ],
    // Avoid default import from winston as it breaks at runtime
    'no-restricted-syntax': [
      'error',
      {
        message:
          'Default import from winston is not allowed, import `* as winston` instead.',
        selector:
          'ImportDeclaration[source.value="winston"] ImportDefaultSpecifier',
      },
      {
        message:
          "`__dirname` doesn't refer to the same dir in production builds, try `resolvePackagePath()` from `@backstage/backend-common` instead.",
        selector: 'Identifier[name="__dirname"]',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
      },
    },
    {
      files: ['*.test.*', 'src/setupTests.*', 'dev/**'],
      rules: {
        // Tests are allowed to import dev dependencies
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            optionalDependencies: true,
            peerDependencies: true,
            bundledDependencies: true,
          },
        ],
      },
    },
  ],
};
```