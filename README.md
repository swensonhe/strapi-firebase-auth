# Strapi plugin Firebase Auth

A plugin for [Strapi Headless CMS](https://github.com/strapi/strapi) that provides end to end Firebase Authentication  feature/Integration with the moderation panel, Show users , create, update, delete and Authenticate Firebase users in one place

A quick description of firebase-auth.


## Step 1 -- Install the plugin

[![npm version](https://badge.fury.io/js/@swensonhe%2Fstrapi-plugin-firebase-auth.svg)](https://www.npmjs.com/package/@swensonhe/strapi-plugin-firebase-auth)

### Via command line

(Use **yarn** to install this plugin within your Strapi project (recommended). [Install yarn with these docs](https://yarnpkg.com/lang/en/docs/install/).)

```bash
yarn add @swensonhe/strapi-plugin-firebase-auth
```

After successful installation you've to re-build your Strapi instance. To archive that simply use:

```bash
yarn build
yarn develop
```

or just run Strapi in the development mode with `--watch-admin` option:

```bash
yarn develop --watch-admin
```

The **Firebase Auth** plugin should appear in the **Plugins** section of Strapi sidebar after you run app again.

As a next step you must configure your the plugin by the way you want to. See [**Configuration**](#🔧-configuration) section.

All done. Enjoy 🎉

### Working in development mode

##Step 2  -- Add service account key (.json)
go to settings page and submit the .json file 



##Step 4 -- add plugin to Strapi:


...  

## 🔧 Configuration
### In `v1.0.28` and older + default configuration state

To setup amend default plugin configuration we recommend to put following snippet as part of `config/plugins.js` or `config/<env>/plugins.js` file. If the file does not exist yet, you have to create it manually. If you've got already configurations for other plugins stores by this way, use just the `firebase-auth` part within existing `plugins` item.

```js
module.exports = () => ({
  //...

"firebase-auth": {
    enabled: true,
  },
  //...
});
```

  
...

##Step 5 -- re-build admin:
`npm run build`

(or just delete the existing ./build directory)

##Step 5 -- grant public permissions:
From the strapi admin, navigate to users-permissions and grant public role to the

http://localhost:1337/admin/settings/users-permissions/roles/2

```
Bound route to firebaseController.validateToken
POST /api/firebase-auth/
```
