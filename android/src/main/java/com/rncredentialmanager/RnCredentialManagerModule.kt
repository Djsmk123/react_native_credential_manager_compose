package com.rncredentialmanager

import android.content.Context
import com.google.gson.Gson

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * RnCredentialManagerModule is responsible for managing credentials in React Native.
 * It provides methods for initializing the credential manager, saving password-based credentials,
 * and retrieving saved credentials.
 */
class RnCredentialManagerModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val utils = CredentialManagerUtils()
  private val mainScope = CoroutineScope(Dispatchers.Main)
  private val context: Context = reactApplicationContext

  override fun getName(): String = NAME

  /**
   * Initializes the credential manager with the given preferences.
   *
   * @param preferImmediatelyAvailableCredentials Whether to prefer immediately available credentials.
   * @param googleClientId The Google Client ID for authentication (optional).
   * @param promise A Promise to resolve or reject based on the initialization result.
   */
  @ReactMethod
  fun init(
    preferImmediatelyAvailableCredentials: Boolean,
    googleClientId: String?,
    promise: Promise
  ) {
    try {
      val (exception, message) = utils.initialize(preferImmediatelyAvailableCredentials, googleClientId, context)
      exception?.let {
        promise.reject(it.code.toString(), it.message)
      } ?: promise.resolve(message)
    } catch (e: Exception) {
      promise.reject("INIT_ERROR", "Failed to initialize: ${e.message}", e)
    }
  }

  /**
   * Saves password-based credentials.
   *
   * @param username The username to save.
   * @param password The password to save.
   * @param promise A Promise to resolve or reject based on the save operation result.
   */
  @ReactMethod
  fun savePasswordBasedCredential(
    username: String,
    password: String,
    promise: Promise
  ) {
    mainScope.launch {
      try {
        withContext(Dispatchers.Main) {
          val activity = currentActivity ?: throw IllegalStateException("Current activity is null")
          val (exception, message) = utils.savePasswordCredentials(username, password, activity)

          exception?.let {
            promise.reject(it.code.toString(), it.message, Exception(it.details))
          } ?: promise.resolve(message)
        }
      } catch (e: Exception) {
        promise.reject("SAVE_CREDENTIAL_ERROR", "Failed to save credentials: ${e.message}", e)
      }
    }
  }

  /**
   * Retrieves saved password credentials.
   *
   * @param passKeyOptions JSON string containing options for passkey retrieval (optional).
   * @param promise A Promise to resolve with the retrieved credentials or reject if an error occurs.
   */
  @ReactMethod
  private fun getCredentials(
    passKeyOptions: String?,
    passKeyEnabled: Boolean,
    passwordBasedCredentialEnabled: Boolean,
    googleCredentialsEnabled: Boolean,
    promise: Promise,

  ) {
    mainScope.launch {
      try {
        withContext(Dispatchers.Main) {
          val activity = currentActivity ?: throw IllegalStateException("Current activity is null")
          val (exception, credentials) = utils.getPasswordCredentials(activity, passKeyOptions,
            credentialMangerFetchOptions = CredentialMangerFetchOptions(
              passKeyEnabled = passKeyEnabled,
              googleSignInEnabled = googleCredentialsEnabled,
              passwordBasedCredentialsEnabled = passwordBasedCredentialEnabled
            )
          )

          exception?.let {
            promise.reject(it.code.toString(), it.message)
          } ?: promise.resolve(
            credentials?.let { credentialResponseBuild(it) }?.let { mapToJson(it) }
          )
        }
      } catch (e: Exception) {
        promise.reject("GET_CREDENTIALS_ERROR", "Failed to retrieve credentials: ${e.message}", e)
      }
    }
  }
  @ReactMethod
  fun handleSignInWithGoogle(
    useButtonFlow: Boolean,
    promise: Promise
  ){
    mainScope.launch {
      try {
        withContext(Dispatchers.Main) {
          val activity = currentActivity ?: throw IllegalStateException("Current activity is null")
          val (exception, message) = utils.saveGoogleCredentials(
            useButtonFlow = useButtonFlow,
            context = activity
          )

          exception?.let {
            promise.reject(it.code.toString(), it.message)
          } ?: promise.resolve(
            mapToJson(googleResponseBuild(message))
          )
        }
      } catch (e: Exception) {
        promise.reject("SIGN_IN_WITH_GOOGLE_ERROR", "Failed to sign in with Google: ${e.message}", e)
      }
    }

  }

  private fun googleResponseBuild(
    message: GoogleIdTokenCredential?
  ): Map<String, String?>
  {
    return mapOf(
      "email" to message?.id,
      "idToken" to message?.idToken,
      "displayName" to message?.displayName,
      "familyName" to message?.familyName,
      "givenName" to message?.givenName,
      "profilePictureUri" to message?.profilePictureUri?.toString(),
      "phoneNumber" to message?.phoneNumber,
      "type" to message?.type,
    )
  }
  private fun mapToJson(map: Map<String, String?>): String {
    return Gson().toJson(map)
  }
  private fun credentialResponseBuild(
    message: CredentialManagerResponse
  ): Map<String, String?>
  {
    return mapOf(
      "type" to message.type.toString(),
      "passwordCredentials" to message.passwordCredentials.toString(),
      "googleCredentials" to googleResponseBuild(message.googleCredentials).toString(),
      "publicKeyCredentials" to message.publicKeyCredentials.toString()
    )
  }

  @ReactMethod
  fun getPasskeyCredential(
    passKeyOptions: String,
    promise: Promise
  ){
    mainScope.launch {
      try {
        withContext(Dispatchers.Main) {
          val activity = currentActivity ?: throw IllegalStateException("Current activity is null")
          val (exception, credentials) = utils.savePasskeyCredentials(context=activity, requestJson =passKeyOptions)
          exception?.let {
            promise.reject(it.code.toString(), it.message)
          } ?: promise.resolve(credentials)
        }
      } catch (e: Exception) {
        promise.reject("GET_PASSKEY_CREDENTIALS_ERROR", "Failed to retrieve credentials: ${e.message}", e)
      }
    }
  }
  @ReactMethod
  private  fun logout(
    promise: Promise
  ){
    mainScope.launch {
      try {
        withContext(Dispatchers.Main) {
          val (exception, message) = utils.logout()
          exception?.let {
            promise.reject(it.code.toString(), it.message)
          } ?: promise.resolve(message)
        }
      } catch (e: Exception) {
        promise.reject("LOGOUT_ERROR", "Failed to logout: ${e.message}", e)
      }
    }
  }

  companion object {
    const val NAME = "RnCredentialManager"
  }
}
