# Strapi Plugin Firebase Authentication

Welcome to the Strapi plugin for Firebase Authentication! This plugin seamlessly integrates Firebase Authentication with
your Strapi Headless CMS, allowing you to manage and authenticate Firebase users directly from the Strapi moderation
panel. This guide will take you through the installation and configuration process and provide information on how to use
this plugin with iOS and Android apps. This plugin would be enabled by default for super admins only.

## How It Works

The Firebase Auth plugin works by authenticating users using Firebase Authentication. Once a user is authenticated, the
plugin creates a Strapi user account for them if it doesn't already exist. The plugin also syncs the user's Firebase
data with their Strapi account.

## Table of Contents

1. [How It Works](#how-it-works)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Client Setup](#client-setup)
6. [After Configuration Changes](#after-configuration-changes)
7. [Troubleshooting](#troubleshooting)
8. [Questions and Issues](#questions-and-issues)

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
        config:{ FIREBASE_JSON_ENCRYPTION_KEY:"encryptMe" }
    },

    // ...
});
```
Replace `"encryptMe"` with a strong and secure key. This key will be used to encrypt the Firebase configuration stored in the database.

### Step 2 - Upload Firebase Service Account Key

1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and download your project's service account JSON key file from the settings
2. Access the Strapi admin panel and navigate to the Firebase plugin settings
3. Upload the `.json` [service account key file](https://firebase.google.com/docs/app-distribution/authenticate-service-account)
4. Save the changes - the configuration will be encrypted and stored securely in the database

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

### Step 5 - Configure Phone-Only User Email Handling (Optional)

For phone-based authentication, you can configure how email addresses are handled:

```js
module.exports = () => ({
    // ...

    "firebase-auth": {
        enabled: true,
        config:{
            FIREBASE_JSON_ENCRYPTION_KEY:"encryptMe",

            // Phone-Only User Email Configuration
            emailRequired: false,  // Set to false to allow null emails for phone-only users
            emailPattern: 'phone_{phoneNumber}@myapp.local',  // Custom pattern if emailRequired is true
        }
    },

    // ...
});
```

**Available Configuration Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `emailRequired` | boolean | `true` | Whether to generate dummy emails for phone-only users |
| `emailPattern` | string | `'{randomString}@phone-user.firebase.local'` | Template pattern for generating dummy emails |

**Available Pattern Tokens:**

- `{randomString}` - 8-character random alphanumeric string (e.g., "a1b2c3d4")
- `{phoneNumber}` - Phone number digits only (e.g., "12345678900")
- `{timestamp}` - Unix timestamp in milliseconds (e.g., "1704067200000")

**Pattern Examples:**
- `'{randomString}@phone-user.firebase.local'` → `a1b2c3d4@phone-user.firebase.local`
- `'phone_{phoneNumber}@myapp.local'` → `phone_12345678900@myapp.local`
- `'user_{timestamp}@temp.local'` → `user_1704067200000@temp.local`
- `'{phoneNumber}_{randomString}@app.com'` → `12345678900_a1b2c3d4@app.com`

⚠️ **Important:** Pattern must include `{randomString}` or `{timestamp}` for uniqueness. The plugin will fail to start if pattern lacks these tokens.

**Configuration Scenarios:**

**Scenario 1: Phone-Only App (No Dummy Emails)**
```js
config: {
    emailRequired: false,  // Users can have null email
}
```

**Scenario 2: Custom Phone-Based Pattern**
```js
config: {
    emailRequired: true,
    emailPattern: 'phone_{phoneNumber}_{randomString}@myapp.local',
}
```

**Scenario 3: Timestamp-Based Uniqueness**
```js
config: {
    emailRequired: true,
    emailPattern: 'user_{timestamp}@temp.local',
}
```

## Usage

### Phone-Only User Authentication

The plugin fully supports phone-only user authentication with configurable email handling.

#### How It Works

**When a user authenticates with only a phone number:**

1. **Firebase Authentication:** User completes SMS verification through Firebase client SDK
2. **Token Exchange:** Client sends Firebase ID token to `/api/firebase-auth` endpoint
3. **Email Handling:** Plugin checks `emailRequired` configuration:
   - If `emailRequired: false` → User created with `email: null`
   - If `emailRequired: true` → Dummy email generated using `emailPattern`
4. **Strapi User:** User record created/updated in Strapi database
5. **JWT Token:** Strapi JWT token returned to client for subsequent API calls

#### Email Field Behavior

| Scenario | `emailRequired` | Resulting Email |
|----------|----------------|-----------------|
| Phone-only signup | `false` | `null` |
| Phone-only signup | `true` | Generated from pattern (e.g., `a1b2c3d4@phone-user.firebase.local`) |
| Phone signup with email in `profileMetaData` | Any | Uses provided email |
| Email/social signup | Any | Uses actual Firebase email |

#### Testing Phone-Only Users (Development)

Use the debug endpoint (disabled in production):

```bash
POST http://localhost:8081/api/debug/create-phone-user
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "firstName": "Test",
  "lastName": "User"
}
```

**Response:**
```json
{
  "user": {
    "id": 123,
    "email": null,  // or generated email if emailRequired: true
    "phoneNumber": "+1234567890",
    "firebaseUserId": "firebase_uid_string",
    "username": "phone_user_1234567890"
  },
  "jwt": "eyJhbGciOiJIUzI1NiIs...",
  "_debug": {
    "emailConfig": {
      "emailRequired": false,
      "emailPattern": "{randomString}@phone-user.firebase.local"
    }
  }
}
```

#### Important Considerations

**✅ Supported Features:**
- User authentication and JWT issuance
- User lookup by phone number
- Profile management
- Strapi admin panel (users display with null email)

**❌ Not Available for Phone-Only Users Without Email:**
- Password reset functionality
- Email-based notifications
- Email-based user search in Firebase

**🔍 User Identification Priority:**
1. `firebaseUserId` (primary identifier)
2. `phoneNumber` (secondary identifier)
3. `email` (tertiary, may be null)

### Handling User Information

To ensure proper handling of user information, make sure to include the following fields in the user object:

- `firebaseUserID` is the field that maps firebase user object to strapi user object.

These fields can be populated during the creation of the user object if `profileMetaData` is provided.
- `firstName`
- `lastName`
- `phoneNumber`
- `email`


#### Using `firebase-auth` Endpoint

When interacting with the `firebase-auth` endpoint, use the following JSON structure in the request body:

```json
{
    "idToken": "{{idToken}}",
    "profileMetaData": {
        "firstName": "name",
        "lastName": "name",
        "email": "email@gmail.com",
        "phoneNumber" : "+100000000"
    }
}
```

These values will be utilized only when the user does not exist and will be ignored in other cases.

#### Hint for strapiKMM SDK Users

If you are using our `strapiKMM SDK`, which is fully compatible with the plugin, user information will be populated automatically when signing in with Google or Apple. You don't need to manually handle these fields when using the SDK.

These values will be applied only when the user is being created for the first time. If the user already exists, the provided data will be ignored, and the existing user information will be retained.

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

## Client Setup

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
To ensure a smooth user login experience with Apple authentication, it’s essential to include the appleEmail field in the user object within the Strapi dashboard.

  - Android: [Link](https://firebase.google.com/docs/auth/android/apple)
  - iOS: [Link](https://firebase.google.com/docs/auth/ios/apple)
  - Web: [Link](https://firebase.google.com/docs/auth/web/apple)

- **Email and Password Authentication:**
  - Android: [Link](https://firebase.google.com/docs/auth/android/password-auth)
  - iOS: [Link](https://firebase.google.com/docs/auth/ios/password-auth)
  - Web: [Link](https://firebase.google.com/docs/auth/web/password-auth)

These short links will take you directly to Firebase's official documentation pages for each authentication method, where you can find in-depth information and code samples.

## After Configuration Changes

This plugin is written in TypeScript. After modifying configuration files or plugin code, you must rebuild the plugin:

```bash
# Navigate to plugin directory
cd src/plugins/firebase

# Rebuild plugin
yarn build

# Return to project root
cd ../../..

# Restart Strapi
yarn debug  # or yarn develop
```

The build process compiles TypeScript files to JavaScript in the `build/` directory, which Strapi uses at runtime.

## Troubleshooting

### Email Pattern Validation Errors

**Error:** `emailPattern must include {randomString} or {timestamp} for uniqueness`

**Solution:** Update your pattern to include uniqueness tokens:
```js
// ❌ Bad - no uniqueness
emailPattern: 'phone_{phoneNumber}@myapp.local'

// ✅ Good - includes uniqueness
emailPattern: 'phone_{phoneNumber}_{randomString}@myapp.local'
```

### User Creation Fails After 3 Attempts

**Error:** `Failed to generate unique email after 3 attempts`

**Cause:** Your email pattern doesn't generate enough unique values.

**Solution:** Ensure pattern includes `{randomString}` or `{timestamp}`:
```js
emailPattern: '{phoneNumber}_{randomString}_{timestamp}@app.local'
```

### Strapi Won't Start After Changes

**Cause:** Plugin not rebuilt after TypeScript changes.

**Solution:**
```bash
cd src/plugins/firebase && yarn build && cd ../../.. && yarn debug
```

## Questions and Issues

Please provide any feedback via a [GitHub Issue](https://github.com/swensonhe/strapi-firebase-auth/issues/new?template=bug_report.md).
