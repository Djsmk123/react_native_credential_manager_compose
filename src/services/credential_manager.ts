import RnCredentialManager from "../channel/channel";
import { GoogleIdTokenCredential, type FetchOptions } from "../models/credentials";
import { Platform } from "react-native";
import { CredentialModel } from '../models/credentials';

/**
 * Checks if the credential manager is supported on the current platform.
 * 
 * @returns {boolean} - Returns true if the platform is Android, false otherwise.
 */
function isSupported(): boolean {
    return Platform.OS === 'android';
}


/**
 * Initializes the credential manager with the specified options.
 * 
 * @param {boolean} preferImmediatelyAvailableCredentials - Indicates whether to prefer credentials that are immediately available.
 * @param {string} [googleClientId] - Optional Google client ID for authentication.
 * @returns {Promise<any>} - A promise that resolves with the initialization result.
 * @throws {Error} - Throws an error if the platform is not supported (only Android is supported).
 */
async function init(
    preferImmediatelyAvailableCredentials: boolean,
    googleClientId?: string,
) {
    try {
        const platform = Platform.OS;
        if (platform !== 'android') {
            throw new Error("Platform not supported");
        }
        const res = await RnCredentialManager.init(preferImmediatelyAvailableCredentials, googleClientId);
        return res;
    } catch (error) {
        throw error;
    }
}

/**
 * Signs in with Google and retrieves the Google ID token credential.
 * 
 * @param {boolean} buttonFlow - Indicates whether to use the button flow for sign-in.
 * @returns {Promise<GoogleIdTokenCredential | null>} - A promise that resolves with the Google ID token credential or null if not available.
 * @throws {Error} - Throws an error if the sign-in process fails.
 */
async function signInWithGoogle(
    buttonFlow: boolean
): Promise<GoogleIdTokenCredential | null> {
    try {
        const credential = await RnCredentialManager.handleSignInWithGoogle(buttonFlow);
        var parsedCredential = JSON.parse(credential);
        return parsedCredential;
    } catch (error) {
        throw error;
    }
}

/**
 * Creates a passkey credential based on the provided request JSON.
 * 
 * @param {string} requestJson - The JSON string containing the request data for creating a passkey.
 * @returns {Promise<any>} - A promise that resolves with the created passkey credential.
 * @throws {Error} - Throws an error if the passkey creation fails.
 */
async function createPasskey(
    requestJson: string,
) {
    try {
        const res = await RnCredentialManager.getPasskeyCredential(requestJson);
        return res;
    } catch (error) {
        throw error;
    }
}

/**
 * Saves a password-based credential using the provided username and password.
 * 
 * @param {string} username - The username for the credential.
 * @param {string} password - The password for the credential.
 * @returns {Promise<void>} - A promise that resolves when the credential is saved.
 * @throws {Error} - Throws an error if the saving process fails.
 */
async function savePasswordBasedCredential(
    username: string,
    password: string,
): Promise<void> {
    try {
        const res = await RnCredentialManager.savePasswordBasedCredential(username, password);
        return res;
    } catch (error) {
        throw error;
    }
}



/**
 * Retrieves credentials based on the provided passkey options and fetch options.
 * 
 * @param {string | null} passKeyOptions - Optional passkey options for retrieving credentials.
 * @param {FetchOptions} fetchOptions - Options to enable or disable various credential types during retrieval.
 * @returns {Promise<CredentialModel | null>} - A promise that resolves with the retrieved credential model or null if not found.
 * @throws {Error} - Throws an error if the retrieval process fails.
 */
async function getCredentials(
    passKeyOptions: string | null,
    fetchOptions: FetchOptions = { passKeyEnabled: true, passwordBasedCredentialEnabled: true, googleCredentialsEnabled: true }
): Promise<CredentialModel | null> {
    try {
        const res = await RnCredentialManager.getCredentials(passKeyOptions,
            fetchOptions.passKeyEnabled,
            fetchOptions.passwordBasedCredentialEnabled,
            fetchOptions.googleCredentialsEnabled
        );
        const resJson = JSON.parse(res);

        const credentialModel: CredentialModel = {
            type: resJson.type,
            passwordBasedCredential: null,
            googleCredentials: null,
            publicKeyCredential: null,
        };

        if (resJson.type === "PasswordCredentials") {
            credentialModel.passwordBasedCredential = resJson.passwordCredentials;
        } else if (resJson.type === "GoogleCredentials") {
            credentialModel.googleCredentials = resJson.googleCredentials;
        } else if (resJson.type === "PublicKeyCredentials") {
            credentialModel.publicKeyCredential = resJson.publicKeyCredentials;
        }

        return credentialModel;
    } catch (error) {
        throw error;
    }
}
async function logout() {
    try {
        const res = await RnCredentialManager.logout();
        return res;
    } catch (error) {
        throw error;
    }
}

// Exporting the CredentialManager object containing all the functions for external use.
const instance = {
    init,
    signInWithGoogle,
    createPasskey,
    savePasswordBasedCredential,
    getCredentials,
    isSupported,
    logout,
}
export default instance;
