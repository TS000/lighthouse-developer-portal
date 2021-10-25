# Vite

|                   |     |                |       |
| ----------------- | --- | -------------- | ----- |
| Decision Made:    | yes | Decision Date: | 10/21 |
| Revisit Decision: | yes | Date           | 01/22 |

**Revisit criteria:**

Decision Made: Yes, but open to revisiting Decision Date: 01/2022
Revisit Decision: Yes Revisit Date: 01/2022
Revisit Criteria: If [Vite](https://vitejs.dev/) updates for better coverage or [Backstage](https://github.com/backstage/backstage) allows for better Browser/Client support.

Decision Makers: @KaemonIsland

## tl;dr

I was able to get Vite to successfully build the frontend app (after much debugging and resolving errors). But, getting the app to run successfully either from the build, or by development was unsuccessful because of a multitude of dependency complications. Things like package versions and using nodejs code that was incompatible with the browser/client.

## History

Lot's of issues with dependencies that had to be resolved just to run the application. Some of them were able to be resolved by using the `resolve.alias` setting within the Vite config. There was one specific problem I had with a `@material-ui/pickers` dependency that I had to manually alter within the `yarn.lock` file because it's a dependency of a dependency that specifies an incompatible version. The issue was posted on Vite [here](https://github.com/vitejs/vite/issues/5244) about 11 days ago.

The primary issue seems to be that some dependencies really on Nodejs modules that are not supported by the browser and cannot be run on client code. I encountered this problem whenever we had an import from anything related to `@backstage`. This is where debugging the issues became increasingly more difficult as I could only view the symptoms that caused the error, and not the exact cause. Most of the error I would search for were unanswered, or had the response of "use something else".

I tried building my own vite app and slowly moving dependencies over, but quickly ran into problems when I started adding @backstage packages. The weirdest issue I came across was when I tried importing the `@backstage/integration-react` package. I couldn't run the app locally, but I was able to serve if after building the app.

### Final Vite Config

I was able to use the following `vite.config.js` to successfully run the build/serve/run commands without any errors. It just would come across issues when you tried to load the page.

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { injectHtml } from 'vite-plugin-html';

// see https://vitejs.dev/config/
export default defineConfig((): any => ({
  // avoid clearing the bash' output
  clearScreen: false,
  plugins: [
    react(),
    injectHtml({
      data: {
        title: 'vite-plugin-html-example',
      },
    }),
  ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: [
      {
        find: /^es5-ext\/(.*)?\/#\/(.*)$/,
        replacement: path.resolve(require.resolve('es5-ext'), '../$1/../#/$2'),
      },
      {
        find: /^.\/#$/,
        replacement: '../#/index.js',
      },
      {
        find: /^.react-virtualized/,
      },
    ],
  },
  build: {
    minify: 'esbuild',
    sourceMap: true,
  },
  rollupInputOptions: {
    preserveEntrySignatures: 'strict',
    plugins: [
      globals,
      builtins,
      resolve({ browser: true, preferBuiltins: false }),
      json,
    ],
    pluginsOptimizer: [globals(), builtins({ crypto: true })],
  },
}));
```

## Pros

- Build times can be very fast and live reloading helps to speed up development time.
- Supports TypeScript and React out of the Box.
- Uses Rollup and esbuild for speed.
- Easy to move back to webpack if we decide to move.

## Cons

- Lot's of difficulty working with packages that use Nodejs code or other incompatible dependencies.
- Still pretty new. Most of the issues I came across or problems I searched for were asked about a month ago.
- Difficult to debug. I had a lot of problems trying to understand errors within the browser console whereas there would be no problems listed in the server.

## Decision

Unfortunately it looks like we'll have to stick with Webpack for now.

Vite is a great build tool for Frontend applications, however I think that it would be best used when creating a brand new app by using their build command, `yarn create vite app-name --template react-ts`, and building off of that.

I did try to create a base Vite app and slowly apply some of the code from lighthouse over in hopes of better debugging, but as soon as I applied `@backstage/core` I had a large list of items that needed to be resolved. I was able to find some answers on the Vite GH Repo + Stackoverflow, it looks like others are having the same problems that I am. A lot of the problems I had were unsolved as they were only asked about 2 months ago.

The biggest issue I'm noticing is that Vite isn't as widely adopted yet, but it's getting there. Most of the issues I came across were still fairly recent. So potentially we could make the move to Vite or another similar build tool in the future when more apps/packages like @backstage build support for them.
