# Customizing Components

A guide for altering, customizing, and updating components from [Backstage](https://backstage.io/docs/overview/what-is-backstage).

## Don't do it!

Before attempting to customize a component ask yourself these questions.

- Is there an API that I can access?
- Is it possible to wrap the component with another?

Most of the time, using an API or wrapping an existing component can provide the desired functionality.

### Use the API

Backstage has tons of APIs available!

> Backstage Plugins strive to be self-contained, with as much functionality as possible residing within the plugin itself and its backend APIs.

Each Utility API is tied to an `APIRef` instance, its only purpose is to reference Utility APIs.

```js
import React from 'react';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export const MyComponent = () => {
  const errorApi = useApi(errorApiRef);

  // Signal to the app that something went wrong, and display the error to the user.
  const handleError = error => {
    errorApi.post(error);
  };

  // the rest of the component ...
};
```

Backstage has an [API Package Index](https://backstage.io/docs/reference/) you can use to search available APIs.

More often than not, components using APIs will require a [React Context](https://reactjs.org/docs/context.html) object that's located higher up within the hierarchy. Most of them are initialized within App.tsx, where all the route's are declared. This means that we can access the same context that the component is using.

For Example, say you need to track search terms, but you are unable to edit the search component...

```js
// Say that this component comes from a package and can't be edited
const UntouchableSearch = () => {
  const { term, setTerm } = useApi(SearchApiRef);

  return (
    <form>
      <input
        value={term}
        onChange={e => {
          setTerm(e.target.value);
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

// because our component is within the context provider, we can access and update the
// same values that the UntouchableSearch component is using.
const MyCoolComponent = () => {
  const { term } = useApi(SearchApiRef);

  // Now we can track the current term whenever it updates in a different component
  useEffect(() => {
    analytics.track(term);
  }, [term]);
};

// The app has wrapped routes with the search API context provider
export const App = () => {
  return (
    <SearchContextProvider>
      <MyCoolComponent />
      <UntouchableSearch />
    </SearchContextProvider>
  );
};
```

### Wrap it

Sometimes we need to pass props down, or add additional functionality to an existing component, like click events.

If we have access to the component, for example it's exported by the package, we can wrap it.

For example, we needed to add a click event to the `SidebarSubmenuItem` in order to allow component `kind` links from the sidebar. Normally we'd just pass a `onClick` event to the component, however TypeScript prevents this as it's not an allowed prop for the component. How can we solve this? With a wrapper!

```js
// By adding a wrapping div element, we can use the onClick event when the `SidebarSubmenuItem` without altering it.
<div
  aria-hidden
  onClick={() => {
    console.log('Clicked!');
  }}
>
  <SidebarSubmenuItem
    title={`${kind}s`}
    to={`catalog?filters[kind]=${kind.toLowerCase()}`}
    icon={catalogKindIcon[kind] || AppsIcon}
  />
</div>
```

## When to customize

There are definitely cases where the only option is to copy/pasta an entire component or plugin to make the changes you need. Most of the time this is because the component that needs to be customized isn't exported. These methods allow us to make any customizations to existing components by directly altering them. Keep in mind that these methods should only be used when there are no other alternatives. It adds extra work and extra code to maintain.

Some situations that can't be fixed by wrapping or API context:

- A component uses it's own context that we can't access.
- The component we need to wrap isn't exported to us.
- TypeScript doesn't allow a specific prop to be passed down.
- I need to edit the style of a nested component that isn't exported.

### Copy/Pasta

Probably the easiest way, just copy/pasta the necessary code into the codebase. You can include only what you need, but sometimes you'll need a lot if the component that needs customizations is deep. At the same time this code will be the hardest to update.

Consider copy/past fore entire plugins/packages if they aren't updated frequently. It'd be easy to check back every now and then for updates, rather than checking individual components.

### Git Subtree

[Git Subtree](https://www.w3docs.com/learn-git/git-subtree.html)
[Stack Overflow Guide](https://stackoverflow.com/questions/24577084/forking-a-sub-directory-of-a-repository-on-github-and-making-it-part-of-my-own-r)

> Git Subtree is an alternative to Git Submodule. It allows nesting one repository inside another one as a subdirectory. A subtree is just a subdirectory that you can commit to, branch, and merge along with your project.

Git Subtree can be a beneficial method to customizing specific components while also keeping it up to date with any commits made to the original repo. This method should be used when a customized component is part of a plugin/package that is updated frequently.

First, clone the entire repository.

`git clone https://github.com/backstage/backstage.git`

Then use `git subtree split` to only include the directory that we want.

`git subtree split --prefix<directory> -b <branch-name>`

Now checkout the newly created branch.

`git checkout <branch-name>`

Now, let's set up the remotes. We'll need to rename the origin to something else.

`git remote rename origin <upstream-name>`

Next we'll need to create a new repo on GitHub to contain our changes.

```bash
git remote add origin <new-repo-url>
git fetch origin
git push -u origin <branch-name>
```

Finally, we can make a new branch called `main` that will contain any customizations.

```bash
git checkout -b main
git push -u origin main
```

CONGRATS!!!!!! You now have a "fork" of the main repo!

#### Making changes to the split repo

Be sure to make changes to the `main` branch that was created. the `<branch-name>` used to create the split should only contain commits from the upstream project.

##### Receiving upstream commits

In order to get updates from the upstream rep, we'll have to use a combo of `git` and `git subtree` commands.

First, update the main branch, `master` for Backstage, to the current version of the main repo.

```bash
git checkout master
git pull
```

This will pull all new commits.

Next, we will update `<branch-name>` with the new filtered version of the commits. Since `git subtree` ensures that commit hashes will be the same, this should be a clean process. Note that you want to run these commands while still on the `master` branch.

`git subtree split --prefix=<directory> --onto <branch-name> -b <branch-name>`

With `<branch-name>` now updated, you can update the `main` branch with whatever customizations.

```bash
git checkout main
git rebase <branch-name>
```

And that's it! A subdirectory, or even individual file can be customized and still be up to date with the primary repository!.

### Make a PR

Would the customizations benefit other users of Backstage? Creating a PR for updated components can help everyone, especially if it's a bug fix! Backstage maintainers are pretty quick to review submitted PRs but can still take time to actually get it merged. For example, a PR to fix a bug in the [github-actions-plugin](https://github.com/backstage/backstage/tree/master/plugins/github-actions) took about 12 days to finally get merged.
