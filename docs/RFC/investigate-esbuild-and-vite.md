# [RFC] Investigate Esbuild and Vite

## Summary

Webpack is the default bundler that came with our instance of Backstage. It's worked great for us so far, but building our application can take up to 5-7 minutes to build. There are some bundler alternatives like [esbuild](https://esbuild.github.io/getting-started/) and [vite](https://vitejs.dev/) that claim to be 10x-100x faster than webpack. This could speed up our build/deploy time by a significant amount.

## Background

Webpack is a tool that lets you bundle your JavaScript applications (supporting both ESM and CommonJS), and it can be extended to support many different assets such as images, fonts, and stylesheets. It's the default bundler that came with our backstage implementation.

## Goal

Decide whether it's worth moving to esbuild or vite for building our application. They should be able to bundle our application and support React + Typescript.

## Findings

### esbuild

Build Time: < 1s

The bundler outputs code for the browser by default. For development builds, we can add source maps. The build can also be minified for production.

[Build API](https://esbuild.github.io/api/#build-api)

The build API call operates on one or more files in the files system. This allows the files to reference each other and be bundled together. Esbuild does not bundle by default and must use the `--bundle` flag.

The Build API can take a ton of options, to name a few:

- Bundle
- Entry Points
- Format
- Inject
- Loaders
- Splitting
- Watch

Esbuild can also use some advanced options. Here are some that stick out to me:

- Asset names
- Conditions
- Entry names
- Global name
- JSX (factory/fragment)
- Log level
- Node Paths
- Tsconfig

Esbuild has a loader that is enabled by default for `.js`, `.cjs`, `.mjs`. The loader has support for TypeScript, JSX, JSON, and CSS.

Note: _Esbuild DOES NOT do any type checking_

[This blog post](https://jamesthom.as/2021/05/setting-up-esbuild-for-typescript-libraries/) covers setting up esbuild for TypeScript applications.

```js
// Config used to bundle app
const esbuild = require('esbuild')

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: true,
  target: 'node14',
  plugins: [nodeExternalsPlugin()]
}).catch(() => process.exit(1))
```

### Vite

(Pronounced like "veet," it's french for quick)

Build Time: 45s-47s

Vite uses esbuild to build/bundle applications quickly.

It consists of two major parts:

- A dev server that provides rich feature enhancements over native ES modules, for example, extremely fast Hot Module Replacement (HMR).
- A build command that bundles your code with Rollup, pre-configured to output highly optimized static assets for production.

Has full Typing support for TypeScript, an extensible Plugin API, and JavaScript API.

Vite has a scaffold that can be adapted for React + TypeScript.

`yarn create vite --template react-ts`

Also, for Vite to work, we need an `index.html` file within the root of the app folder. We can specify a different `index.html` for the dist directory.

Some required settings must be set in the `tsconfig` file for Vite to work with TypeScript.

_isolatedModules_: esbuild transpiles without type info. Doesn't support features like `const enum` and implicit type-only imports

_useDefineForClassFields_: This should be true by default per typescript anyways, but is still required.

```JSON
{
  "compilerOptions": {
    "isolatedModules": true,
    "useDefineForClassFields": true,
  }
}
```

## Recommendation

I believe it is worth our time to move from webpack to using Vite to build our application. I was able to bundle the frontend application by following Vite's [getting started](https://vitejs.dev/guide/) section. Vite uses esbuild to bundle projects, so we won't need to use it directly. There might be some configuration settings we'll need to pass to esbuild, but those are easy to locate.

I found a fantastic article about setting up Vite for an application that uses React + TypeScript. It looks like we need to create the vite scaffold using `yarn create vite --template react-ts` and copy/paste some of the configurations over to the app. This would be our best resource, along with Vites documentation, to convert our application.

https://javascript.plainenglish.io/migrating-a-150k-loc-codebase-to-vite-and-esbuild-how-part-2-3-91b0b873f388

The upgrade burden seems minimal. Vite has out-of-the-box features for projects that use React + TypeScript. From what I could tell, we wouldn't need to change any of our code, just updating the tsconfig and adding vite configs to our project. Because of this, it'd be easy to swap back to webpack if we come across any problems down the line.


## Reference

- [esbuild](https://esbuild.github.io/getting-started/)
- [Setting up esbuild for typescript libraries](https://jamesthom.as/2021/05/setting-up-esbuild-for-typescript-libraries/)
- [vite](https://vitejs.dev/)
- [Moving from Webpack to Vite](https://javascript.plainenglish.io/migrating-a-150k-loc-codebase-to-vite-and-esbuild-how-part-2-3-91b0b873f388)