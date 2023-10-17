# Strapi Plugin Firebase Authentication

Welcome to the Strapi plugin for Firebase Authentication! This plugin seamlessly integrates Firebase Authentication with
your Strapi Headless CMS, allowing you to manage and authenticate Firebase users directly from the Strapi moderation
panel. This guide will take you through the installation and configuration process and provide information on how to use
this plugin with iOS and Android apps.

## How it works

The Firebase Auth plugin works by authenticating users using Firebase Authentication. Once a user is authenticated, the
plugin creates a Strapi user account for them if it doesn't already exist. The plugin also syncs the user's Firebase
data with their Strapi account.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Usage](#usage)
4. [Client Setup](#client-setup)
5. [Question and issues](#questions-and-issues)

## Installation

To get started, you need to install the Firebase Auth plugin for Strapi. We recommend using yarn for this installation.

### Via Command Line

```bash
yarn add @swensonhe/strapi-plugin-firebase-auth
```

Once the installation is complete, you must rebuild your Strapi instance. You can do this with the following commands:

```bash
yarn build
yarn develop
```

Alternatively, you can run Strapi in development mode with the `--watch-admin` option:

```bash
yarn develop --watch-admin
```

The **Firebase Auth** plugin should now be available in the **Plugins** section of your Strapi sidebar.

## Configuration

In order to configure the Firebase Auth plugin, follow these steps:

### Step 1 - Enable the Plugin

In your Strapi project, edit the `config/plugins.js` or `config/<env>/plugins.js` file to enable the Firebase Auth
plugin. If the file doesn't exist, create it manually. If you already have configurations for other plugins, add
the `firebase-auth` section to your existing `plugins` configuration.

```js
module.exports = () => ({
    // ...

    "firebase-auth": {
        enabled: true,
    },

    // ...
});
```

### Step 2 - Add Service Account Key

Navigate to the settings page within Strapi and submit
the `.json` [service account key file](https://firebase.google.com/docs/app-distribution/authenticate-service-account).
This key is essential for Firebase Authentication to work properly.

### Step 3 - Rebuild Admin Panel

After configuring the plugin, rebuild the Strapi admin panel:

```bash
npm run build
```

Alternatively, you can simply delete the existing `./build` directory.

### Step 4 - Grant Public Permissions

From the Strapi admin panel, navigate to "Users-permissions" and grant public role
to `{Your domain or localhost}/admin/settings/users-permissions/roles/2`. Make sure to enable public access to the
Firebase Authentication endpoint.

That's it! You're ready to use Firebase Authentication in your Strapi project. Enjoy! 🎉

## Usage

### Client Links and Token Retrieval

To enable Firebase Authentication in your iOS, Android, or web app and obtain authentication tokens, follow the provided
links and their brief descriptions:

- **Android Firebase Setup:**
  [Link](https://firebase.google.com/docs/android/setup)

  _Set up Firebase Authentication in your Android app by following the instructions on this page. It will guide you
  through integrating Firebase into your Android project._

- **iOS Firebase Setup:**
  [Link](https://firebase.google.com/docs/ios/setup)

  _For iOS app integration, this link will lead you to Firebase's official documentation. It outlines the steps to add
  Firebase Authentication to your iOS project._

- **Web Firebase Setup:**
  [Link](https://firebase.google.com/docs/web/setup)

  _If you're looking to incorporate Firebase Authentication into your web application, this link provides comprehensive
  guidance on setting up Firebase in a web project. It's an essential resource for web-based authentication using
  Firebase._

## Client setup

**Android Sample:**

- To set up Google Sign-In on Android, follow the official Firebase
  documentation: [Android Firebase Authentication with Google](https://firebase.google.com/docs/auth/android/google-signin)
- After signing with Google,you need to get the GoogleAuthProvider Credential and pass it to firebaseSDK to be able to get the user token
- Sample Code:
```kotlin
// Obtain an ID token from Google. Use it to authenticate with Firebase.
val firebaseCredential = GoogleAuthProvider.getCredential(idToken, null)
auth.signInWithCredential(firebaseCredential)
    .addOnCompleteListener(this) { task ->
        if (task.isSuccessful) {
            val token = it.result?.token
            // Now, you can pass the token to the Firebase plugin by exchanging the Firebase Token using the `/firebase-auth` endpoint.
        } else {
            // If the sign-in fails, display a message to the user.
            Log.w(TAG, "signInWithCredential:failure", task.exception)
        }
    }
```

**iOS Sample:**

- For iOS, use the Firebase Authentication with Google Sign-In
  guide: [iOS Firebase Authentication with Google](https://firebase.google.com/docs/auth/ios/google-signin)
- After signing with Google,you need to get the GoogleAuthProvider Credential and pass it to firebaseSDK to be able to get the user token

- Sample Code:
```swift
  guard let clientID = FirebaseApp.app()?.options.clientID else { return }

// Create Google Sign In configuration object.
let config = GIDConfiguration(clientID: clientID)
GIDSignIn.sharedInstance.configuration = config

// Start the sign in flow!
GIDSignIn.sharedInstance.signIn(withPresenting: self) { [unowned self] result, error in
  guard error == nil else {
    // ...
  }

  guard let user = result?.user,
    let idToken = user.idToken?.tokenString
  else {
    // ...
  }

  let credential = GoogleAuthProvider.credential(withIDToken: idToken,
                                                 accessToken: user.accessToken.tokenString)

  // ...
  
  Auth.auth().signIn(with: credential) { result, error in

  // At this point, our user is signed in
  // Now you need to pass the token to firebasePlugin using exchange the firebase Token using `/firebase-auth` endpoint
}


}
  ```

**Web Sample:**

- To set up Firebase Authentication with Google Sign-In on the web, follow this Firebase
  documentation: [Web Firebase Authentication with Google](https://firebase.google.com/docs/auth/web/google-signin)
- After signing with Google,you need to get the GoogleAuthProvider Credential and pass it to firebaseSDK to be able to get the user token
- Sample Code:
```javascript
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.customData.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});  
```

These samples will guide you on how to implement Google Sign-In and obtain the authentication token, which you can then
pass to the Firebase plugin for user authentication using `/firebase-auth` endpoint

**For More Samples:**

If you need additional samples for authentication methods like Sign-In with Apple, Email and Password, or others, please refer to the official Firebase documentation for comprehensive details:

- [Firebase Official Documentation](https://firebase.google.com/docs/)

**Short Links to Specific Authentication Methods:**

- **Sign-In with Apple:**
  - Android: [Link](https://firebase.google.com/docs/auth/android/apple)
  - iOS: [Link](https://firebase.google.com/docs/auth/ios/apple)
  - Web: [Link](https://firebase.google.com/docs/auth/web/apple)

- **Email and Password Authentication:**
  - Android: [Link](https://firebase.google.com/docs/auth/android/password-auth)
  - iOS: [Link](https://firebase.google.com/docs/auth/ios/password-auth)
  - Web: [Link](https://firebase.google.com/docs/auth/web/password-auth)

These short links will take you directly to Firebase's official documentation pages for each authentication method, where you can find in-depth information and code samples.

### Questions and Issues
Please provide any feedback via a [GitHub Issue](https://github.com/swensonhe/strapi-firebase-auth/issues/new?template=bug_report.md).
