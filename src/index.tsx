
import instance from "./services/credential_manager";
import {
  CredentialModel,
  PasswordBasedCredentialModel,
  GoogleIdTokenCredential,
  PublicKeyCredential,
  CredentialType


} from './models/credentials';




const credentialManager = {
  CredentialModel,
  PasswordBasedCredentialModel,
  GoogleIdTokenCredential,
  PublicKeyCredential,
  CredentialType,
  instance,


}
export default credentialManager;
