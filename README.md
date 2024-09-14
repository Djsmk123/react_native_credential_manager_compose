# Credential Manager

[Credential Manager](https://developer.android.com/jetpack/androidx/releases/credentials) is a Jetpack API that supports multiple sign-in methods, such as username and password, passkeys, and federated sign-in solutions (like Sign-in with Google) in a single API, simplifying integration for developers.

For users, Credential Manager unifies the sign-in interface across authentication methods, making it clearer and easier to sign into apps, regardless of the chosen method.

> Note: This package is currently only supported for Android.

## Getting Started 

Add the dependency to your `package.json` file:

```
sh
npm install react-native-rn-credential-manager

```

## Setup Android

1. Add proguard rules:
   Create or update `android/app/proguard-rules.pro`:

   ```
   -if class androidx.credentials.CredentialManager
   -keep class androidx.credentials.playservices.** {
     *;
   }
   ```

2. Update `android/app/build.gradle`:

   ```gradle
   android {
     buildTypes {
       release {
         minifyEnabled true
         proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
       }
     }
   }
   ```

## Usage in React Native

1. Import the package:

   ```javascript
   import credentialManager from 'react-native-rn-credential-manager';
   ```

2. Check if the platform is supported:

   ```javascript
   if (credentialManager.instance.isSupported()) {
     // Supported
   }
   ```

3. Initialize the Credential Manager:

   ```javascript
   await credentialManager.instance.init(
     true, // preferImmediatelyAvailableCredentials
     googleClientId // Optional for Google Sign-In
   );
   ```

4. Save credentials:

   ```javascript
   await credentialManager.instance.savePasswordBasedCredential(username, password);
   ```

5. Save Google credentials:

   ```javascript
   const gCredential = await credentialManager.instance.signInWithGoogle(true);
   ```

6. Get saved credentials:

   ```javascript
   const credential = await credentialManager.instance.getCredentials(null, {
     passKeyEnabled: true,
     passwordBasedCredentialEnabled: true,
     googleCredentialsEnabled: true,
   });
   ```

7. Logout:

   ```javascript
   await credentialManager.instance.logout();
   ```

## Additional Setup

- [Google Sign-In Setup (optional)](./google.md)
- [Passkey Integration (optional)](./passkey.md)

## Error Handling

For detailed error codes and messages, see [Error Handler](./errors.md).

## Properties and Methods

For a complete list of properties and methods, see [Properties and Methods](./methods.md).

## Upcoming Features

- iOS Support

## Contributing

Contributions are welcome! Please see the [Contributing Guidelines](CONTRIBUTING.md) for more details.

If you find this package useful, please:
- Star it on GitHub
- Tweet about it
- Mention it in your blog posts

For bug reports, feature requests, or questions, please open an issue on GitHub.
