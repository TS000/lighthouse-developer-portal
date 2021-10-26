# [RFC] Documentation Generator

**Summary**: Allow documentation to be generated from code comments.

Most documentation generators have a fairly similar syntax. So the main purpose of this RFC is to help decide between which syntax we would like more. I was able to find two generators that I think we should choose between, JSDoc and TypeDoc. Both of these generators have `eslint-plugins` that would allow us to require comments, and other nitpicking. They also allow us to generate documentation within GitHub Actions which is great. Like I said, the main difference is how the syntax will work with TypeScript.

> Note: Please feel free to let me know if there is another doc generator that you think we should consider.

## Background

Why do we need a documentation generator? I think I speak for everyone when I say that documenting everything can become a huge pain and can take up time a lot of our time. A documentation generator can take our commented code and build a good looking HTML website, so long as we make good explanatory comments. Automating documentation is just another thing that can save us a ton of time and allow us to work on more important/fun features.

## Goal

To decide on which documentation generator, JSDoc or TypeDoc, should be used when adding comments to the codebase. Similar to the summary both generators have similar syntax, eslint support, and GitHub Actions. The only real decision to make is which syntax we'd rather use.

### Generating documentation

Both doc generators are able to run with a single CLI command. They can take inline arguments, or use a config file to determine where to look for files, and where it should output the generated documentation.

For example if we want to generate docs from src using a specified config and then putting the generated docs into a docs folder.

JSDoc can have plugins or other settings added to a `jsdoc.json` file as well.
JSDoc -> `/path/to/jsdoc src -r -c /path/to/my/conf.json -d docs`

Typedoc can use most of the TypeScript compiler options as well as the tsconfig file.
TypeDoc -> `typedoc --out docs src`

## JSDoc

[JSDoc GitHub](https://github.com/jsdoc/jsdoc)

[JSDoc + TypeScript Playground](https://www.typescriptlang.org/play#example/jsdoc-support)

JSDoc has a lot of support and is quite popular. Documenting code can be incredibly easy and provide a lot of information about what's going on in a file. It's been a great way to add `typing` to JavaScript without using TypeScript.

Supported Types:

- @type
- @param (or @arg or @argument)
- @returns (or @return)
- @typedef
- @callback
- @template
- @class (or @constructor)
- @this
- @extends (or @augments)
- @enum
- @deprecated

In JSDoc types are listed within the comment.

```JS
  /** @type {string} */
  let s;

  /**
 * @param {string}  p1 - A string param.
 * @param {string=} p2 - An optional param (Closure syntax)
 * @param {string} [p3] - Another optional param (JSDoc syntax).
 * @param {string} [p4="test"] - An optional param with a default value
 * @return {string} This is the result
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // TODO
}
```

Unfortunately, JSDoc doesn't support TypeScript out of the box. There are some plugins like [better-docs](https://github.com/SoftwareBrothers/better-docs) that can parse `.ts | .tsx` files. However, types aren't displayed correctly within the generated documentation. Meaning that we'd have to list out types within the comments and within the code. There is a way around it (I've done it before) but it requires some extra time and monkey-patching to get it to work correctly.

## TypeDoc

[TypeDoc GitHub](https://github.com/TypeStrong/TypeDoc)

It appears that TypeDoc can do everything that JSDoc can, but with out of the box support for TypeScript files. It also uses the `tsconfig` file to figure out where it should look for `.ts | .tsx` files.

All comments are parsed as Markdown which adds additional styling for us!

TypeDoc doesn't support all the tags that JSDoc does, but that's because it infers more information from the TypeScript code. So you are more than welcome to type regular TypeScript without needing to declare types within comments.

```JS
/**
 * @param text  Comment for parameter ´text´.
 */
function doSomething(target: any, text: string): number;
```

Supported Tags:

- @param `<param name>`
- @typeParam `<param name>` or @template `<param name>`
- @return(s)
- @event
- @hidden and @ignore
- @internal
- @category
- @module
- @typedef, @callback
- @public, @protected, and @private

TypeDoc can also support `.js | .jsx` files if the `allowJS` option is set to true in the `tsconfig`. Just note that it can't derive the type from the code so they would need to be explicitly stated within the comment.

## Recommendation

Considering everything that we would want for a documentation generator.

- Linting
- Syntax Highlighting
- Doc Generation with CI/CD
- JavaScript/TypeScript Support
- Tags

I believe that TypeDoc is the best choice considering it supports TypeScript out of the box. The syntax isn't very different from JSDoc, we just omit the types after the `@param` and `@returns` because it's written within the code!

### Techdocs

We can specify another documentation folder so that we don't conflict with TechDocs. The only issue will be that GitHub Pages can only have one site per project. I don't think that there is a way for us to merge Techdocs + another site.

We could possibly setup an account with Netlify or Heroku to publish the generated documentation. Or open another repository which we push to using GitHub Actions?

### eslint enforcement

In my experience, I'm used to enforcing comments on All functions, just to describe the purpose, params, and return values. It helps devs to quickly understand how to use the function. It also helps to reveal if the function is doing too much.

Anything else like Types, Interfaces, Variables have felt pretty self explanatory. When something does become convoluted, or can be confusing I'll usually add a comment explaining it's purpose.

Errors

- Classes (Which should be avoided)
- Required for all Functions and include:
  - A short description
  - All parameters (If applicable)
  - Returns (If applicable)

Anything else is optional for me. We could include warnings for Types and Interfaces?
