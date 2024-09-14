/**
 * Enum representing the types of credentials supported.
 */
enum CredentialType {
    PasswordCredentials = 'passwordCredentials', // Represents password-based credentials.
    GoogleCredentials = 'googleCredentials',     // Represents Google ID token credentials.
    PublicKeyCredentials = 'publicKeyCredentials' // Represents public key credentials.
}

/**
 * Class representing a credential model that can hold different types of credentials.
 */
class CredentialModel {
    passwordBasedCredential: PasswordBasedCredentialModel | null; // Password-based credential, if available.
    googleCredentials: GoogleIdTokenCredential | null;           // Google ID token credential, if available.
    publicKeyCredential: PublicKeyCredential | null;           // Public key credential, if available.
    type: CredentialType;                                       // The type of credential.

    /**
     * Creates an instance of CredentialModel.
     * @param {CredentialType} type - The type of credential.
     * @param {PasswordBasedCredentialModel | null} passwordBasedCredential - The password-based credential.
     * @param {GoogleIdTokenCredential | null} googleCredentials - The Google ID token credential.
     * @param {PublicKeyCredential | null} publicKeyCredential - The public key credential.
     */
    constructor(type: CredentialType, passwordBasedCredential: PasswordBasedCredentialModel | null, googleCredentials: GoogleIdTokenCredential | null, publicKeyCredential: PublicKeyCredential | null) {
        this.type = type;
        this.passwordBasedCredential = passwordBasedCredential;
        this.googleCredentials = googleCredentials;
        this.publicKeyCredential = publicKeyCredential;
    }
}

/**
 * Class representing a password-based credential.
 */
class PasswordBasedCredentialModel {
    username: string; // The username for the credential.
    password: string; // The password for the credential.

    /**
     * Creates an instance of PasswordBasedCredentialModel.
     * @param {string} username - The username for the credential.
     * @param {string} password - The password for the credential.
     */
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

/**
 * Class representing a Google ID token credential.
 */
class GoogleIdTokenCredential {
    email: string; // The email of the user.
    idToken: string; // The ID token for authentication.
    displayName?: string; // The display name of the user.
    familyName?: string; // The family name of the user.
    givenName?: string; // The given name of the user.
    phoneNumber?: string; // The phone number of the user.
    profilePictureUri?: string; // The URI of the user's profile picture.

    /**
     * Creates an instance of GoogleIdTokenCredential.
     * @param {string} email - The email for the user.
     * @param {string} idToken - The ID token for authentication.
     * @param {string} [displayName] - The display name of the user.
     * @param {string} [familyName] - The family name of the user.
     * @param {string} [givenName] - The given naemailme of the user.
     * @param {string} [phoneNumber] - The phone number of the user.
     * @param {string} [profilePictureUri] - The URI of the user's profile picture.
     */
    constructor(email: string, idToken: string, displayName?: string, familyName?: string, givenName?: string, phoneNumber?: string, profilePictureUri?: string) {
        this.email = email;
        this.idToken = idToken;
        this.displayName = displayName;
        this.familyName = familyName;
        this.givenName = givenName;
        this.phoneNumber = phoneNumber;
        this.profilePictureUri = profilePictureUri;
    }
}

/**
 * Class representing a public key credential.
 */
class PublicKeyCredential {
    rawId?: string; // The raw ID of the credential.
    authenticatorAttachment?: string; // The attachment type of the authenticator.
    type?: string; // The type of the credential.
    id?: string; // The ID of the credential.
    response?: {
        clientDataJSON?: string; // The client data in JSON format.
        attestationObject?: string; // The attestation object.
        authenticatorData?: string; // The authenticator data.
        publicKey?: string; // The public key.
        transports?: string[]; // The transports used.
        signature?: string; // The signature.
        userHandle?: string; // The user handle.
    };
    transports?: string[]; // The transports used for the credential.
    clientExtensionResults?: {
        credProps?: {
            rk?: boolean; // Indicates if resident key is supported.
        };
    };
    publicKeyAlgorithm?: number; // The algorithm used for the public key.
    publicKey?: string; // The public key.

    /**
     * Creates an instance of PublicKeyCredential.
     * @param {string} [rawId] - The raw ID of the credential.
     * @param {string} [authenticatorAttachment] - The attachment type of the authenticator.
     * @param {string} [type] - The type of the credential.
     * @param {string} [id] - The ID of the credential.
     * @param {object} [response] - The response object containing credential data.
     */
    constructor(rawId?: string, authenticatorAttachment?: string, type?: string, id?: string, response?: {
        clientDataJSON?: string;
        attestationObject?: string;
        authenticatorData?: string;
        publicKey?: string;
        transports?: string[];
        signature?: string;
        userHandle?: string;
    }) {
        this.rawId = rawId;
        this.authenticatorAttachment = authenticatorAttachment;
        this.type = type;
        this.id = id;
        this.response = response;
        this.transports = this.transports;
        this.clientExtensionResults = this.clientExtensionResults;
        this.publicKeyAlgorithm = this.publicKeyAlgorithm;
        this.publicKey = this.publicKey;
    }
}

/**
 * Interface representing options for fetching credentials.
 */
interface FetchOptions {
    passKeyEnabled: boolean; // Indicates if passkey is enabled.
    passwordBasedCredentialEnabled: boolean; // Indicates if password-based credentials are enabled.
    googleCredentialsEnabled: boolean; // Indicates if Google credentials are enabled.
}

export {
    CredentialModel, PasswordBasedCredentialModel, GoogleIdTokenCredential, PublicKeyCredential, CredentialType,
    type FetchOptions
};
