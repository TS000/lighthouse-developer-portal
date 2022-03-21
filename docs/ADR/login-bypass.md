# Bypass Login page

|                |     |                |         |
| -------------- | --- | -------------- | ------- |
| Decision Made: | yes | Decision Date: | 03/2022 |

**Revisit criteria:**

Decision Made: Yes
Revisit Decision: No
Revisit Criteria: None

Decision Makers: @keyluck

## tl;dr
Customizing the existing login page is a better alternative to completely removing the login page or attempting to bypass it.

## History
Authentication in Backstage requires a SignIn component that is assigned to the Backstage app using the CreateApp function. Navigation requires users are logged in to access any page besides the login page. Automatically logging a user in is one option for authentication but it requires the application to use a single provider. We need a configuration with multiple providers. I attempted to setup automatic login as a guest with the option to login through another provider( i.e. Github). I was able to successfully auto-login as a guest, but attempts to sign in with another provider would cause indeterminate authentication states. At times I would be simultaneously logged out and logged in, such as the backend logs indicating an authenticated Github user but the frontend would only re-route to the login page, or even signed in as a guest in the frontend but signed in with Github for the backend.

The current approach uses similar components to the existing authentication implementation only with a more customized login page. Now the login page contains a logo and information card. It can also be configured further to include a sidebar with the existing provider cards as sidebar items to make room for more helpful informational cards for users.


## Pros
- User authentication works as intended from out of the box Backstage components
- The sign in page can be customized to add styles, and components such as sidebars, headers, logos, or cards as needed
- The existing ProviderComponents(the cards show on the login page), can be rewritten to use the same functions but rendered differently such as sidebar items in a sidebar

## Cons
- No auto-login for guest until previously logged in as guest
