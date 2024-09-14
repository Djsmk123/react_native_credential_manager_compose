import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import credentialManager from 'react-native-rn-credential-manager';
import { CredentialType, PasswordBasedCredentialModel, type CredentialModel } from '../../src/models/credentials';
import LogoutButton from './home';

const credManager = credentialManager.instance;

export default function App() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPasswordRegister, setShowPasswordRegister] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Google client ID and RP ID for credential management
  const googleClientId = "YOUR_GOOGLE_CLIENT_ID";
  const rpId = "blogs-deeplink-example.vercel.app"; // use this for testing purposes

  // Initialize credential manager on component mount
  useEffect(() => {
    const initCredentialManager = async () => {
      setIsSupported(credManager.isSupported());
      try {
        const res = await credManager.init(true, googleClientId);
        console.log("Initialized credential manager", res);
      } catch (error) {
        console.error("Error initializing credential manager", error);
        Alert.alert("Error", "Failed to initialize credential manager");
      }
    };
    initCredentialManager();
  }, []);

  // Register a password-based credential
  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }
    try {
      const res = await credManager.savePasswordBasedCredential(username, password);
      console.log("Credential saved successfully", res);
      setShowPasswordRegister(false);
      Alert.alert("Success", "Credential saved successfully");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error saving password-based credential", error);
      Alert.alert("Error", "Failed to save credential");
    }
  };

  // Register a passkey credential
  const handlePasskeyRegister = async () => {
    if (!username) {
      Alert.alert("Error", "Please enter a username");
      return;
    }
    const requestPayload = {
      challenge: "HjBbH__fbLuzy95AGR31yEARA0EMtKlY0NrV5oy3NQw",
      rp: { name: "CredMan App Test", id: rpId },
      user: {
        id: getEncodedUserId(),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 }
      ],
      timeout: 1800000,
      attestation: "none",
      excludeCredentials: [
        { id: "ghi789", type: "public-key" },
        { id: "jkl012", type: "public-key" }
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "required"
      }
    };
    try {
      const res = await credManager.createPasskey(JSON.stringify(requestPayload));
      console.log("Passkey created successfully", res);
      Alert.alert("Success", "Passkey created successfully");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error creating passkey", error);
      Alert.alert("Error", "Failed to create passkey");
    }
  };

  // Sign in using saved credentials
  const handleSignIn = async () => {
    try {
      const res = await credManager.getCredentials(JSON.stringify({
        challenge: "HjBbH__fbLuzy95AGR31yEARA0EMtKlY0NrV5oy3NQw",
        rpId: rpId,
        userVerification: "required",
      }), {
        passKeyEnabled: true,
        passwordBasedCredentialEnabled: true,
        googleCredentialsEnabled: true,
      });
      const credential = res as CredentialModel;
      console.log("Retrieved credential", credential);
      handleCredentialSignIn(credential);
    } catch (error) {
      console.error("Error retrieving saved credential", error);
      Alert.alert("Error", "Failed to retrieve saved credential");
    }
  };

  // Handle credential sign-in based on type
  const handleCredentialSignIn = (credential: CredentialModel) => {
    switch (credential.type) {
      case CredentialType.PasswordCredentials:
        const passwordBasedCredential = credential as unknown as PasswordBasedCredentialModel;
        console.log("Signed in with username:", passwordBasedCredential.username);
        Alert.alert("Success", `Signed in as ${passwordBasedCredential.username}`);
        setUsername(passwordBasedCredential.username);
        break;
      case CredentialType.PublicKeyCredentials:
        Alert.alert("Success", "Signed in with passkey");
        setUsername("Passkey");
        break;
      case CredentialType.GoogleCredentials:
        const googleIdTokenCredential = credential;
        console.log("Google ID Token Credential:", googleIdTokenCredential);
        Alert.alert("Success", `Signed in as ${googleIdTokenCredential.googleCredentials?.email}`);
        setUsername("Google");
        break;
      default:
        Alert.alert("Error", "Unknown credential type");
    }
    setIsLoggedIn(true);
  };

  // Sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      console.log("Google Sign-In pressed");
      const res = await credManager.signInWithGoogle(true);
      console.log("Google Sign-In response", res);
      Alert.alert("Success", "Signed in with Google");
      setIsLoggedIn(true);
      setUsername(JSON.stringify(res)); // Assuming the Google sign-in response includes an email field
    } catch (error) {
      console.error("Error during Google Sign-In", error);
      Alert.alert("Error", "Failed to sign in with Google");
    }
  };

  // Handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Render the app UI
  if (isLoggedIn) {
    return <LogoutButton onLogout={handleLogout} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Credential Manager</Text>
      </View>
      {isSupported ? (
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#999"
          />
          {showPasswordRegister && (
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          )}
          <View style={styles.buttonContainer}>
            {showPasswordRegister ? (
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => setShowPasswordRegister(true)}>
                <Text style={styles.buttonText}>Register with Password</Text>
              </TouchableOpacity>
            )}
            {!showPasswordRegister && (
              <TouchableOpacity style={styles.button} onPress={handlePasskeyRegister}>
                <Text style={styles.buttonText}>Register with Passkey</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <Text style={styles.googleButtonText}>Sign In with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.notSupportedText}>Not Supported</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    backgroundColor: '#4285F4',
    padding: 16,
    elevation: 4,
  },
  appBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',  // Changed text color to black
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4285F4',
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  notSupportedText: {
    fontSize: 18,
    color: '#666',
  },
});

// Utility function to encode user ID
const getEncodedUserId = () => {
  return btoa("HjBbH__fbLuzy95AGR31yEARA0EMtKlY0NrV5oy3NQw");
};
