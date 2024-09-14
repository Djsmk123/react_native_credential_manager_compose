package com.rncredentialmanager

/**
 * Class representing exceptions thrown by the Credential Manager.
 * @property code The error code associated with the exception.
 * @property message A descriptive message explaining the exception.
 * @property details Additional details about the exception (optional).
 */
class CredentialManagerExceptions(val code: Int, val message: String, val details: String?)
