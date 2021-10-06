//import nacl from "tweetnacl";
import Chance from "chance";
//import svUtils from "./encryption_utils.js";
import { Random } from 'meteor/random'
import { Keys } from "../../../api/collections/keys/shared"
import WebCrypto from 'easy-web-crypto'


const svEnc = {
  async initUser(passphrase, displayName) {
    //geneate key pair
    //encrypt with user password
    //update user profile with encrypted keys

    const chance = new Chance();
    console.log(passphrase)
    //Generate user's Async KeyPair
    const keyPair = await WebCrypto.genKeyPair()
    const privateKey = await WebCrypto.exportPrivateKey(keyPair.privateKey);
    const publicKey = await WebCrypto.exportPublicKey(keyPair.publicKey);

    console.log("privateKey", privateKey);
    console.log("publicKey", publicKey);

    const encMasterKey = await WebCrypto.genEncryptedMasterKey(passphrase);    
    const masterKey = await WebCrypto.decryptMasterKey(passphrase, encMasterKey)
    console.log(masterKey)
    const privateKeyCipher = await WebCrypto.encrypt(masterKey, privateKey)

    console.log("privateKeyCipher", privateKeyCipher);
    
    var isGoodSharingCode = false;
    var sharingCode = "";
    while (isGoodSharingCode == false) {
      sharingCode =
        chance.word({
          syllables: 3
        }) +
        chance.integer({
          min: 0,
          max: 9
        });
      isGoodSharingCode = Meteor.call("checkSharingCode", sharingCode);
    }
    //store encrypted keys to user accounts
    //this Meteor.call is under /server/encryption.js
    Meteor.call(
      "storeKeys",
      privateKeyCipher,
      publicKey,
      encMasterKey,
      sharingCode,
      "free",
      displayName
    );
    return keyPair.privateKey;
  },

  async getUserPrivateKey(passphrase, encMasterKey, privateKeyCipher) {
    var profile = Meteor.user().profile;
    // decrypt private key of the user using his password and nonce
    console.log(encMasterKey)
    console.log(privateKeyCipher)
    const masterKey = await WebCrypto.decryptMasterKey(passphrase, encMasterKey)    
    var privateKey = await WebCrypto.decrypt(masterKey, privateKeyCipher)      
    privateKey = await WebCrypto.importPrivateKey(privateKey);
    console.log(privateKey)  
    return privateKey;
  },

  async encryptItem(item, privateKey) {    
    const key = await WebCrypto.genAESKey(extractable = true, mode = 'AES-GCM', keySize = 256)    
    const exportedKey = await WebCrypto.exportKey(key)
    item.contents = await WebCrypto.encrypt(key, item.contents)
    item.recipients = [Meteor.userId()]
    item.keys = []    
    item.recipients.forEach(recipient => {
      item.keys.push({userId: recipient, key: exportedKey })
    })    
    return item
  },

  async decryptItem(item, privateKey) {      
    const keyData = item.keys.find(key => {
      return key.userId = Meteor.userId
    })    
    const importedKey = await WebCrypto.importKey(keyData.key)        
    item.contents = await WebCrypto.decrypt(importedKey, item.contents)    
    return item
  },

 

  /*changePassword: function(newPassword) {
    var self = this;
    // encrypt the user's private key
    var nonce = svUtils.generate24ByteNonce();
    password = svUtils.generate32ByteKeyFromPassword(newPassword);
    userPrivateKey = new Uint8Array(
      _.values(Session.get("userKeys").privateKey)
    );
    var privateKey = svUtils.symEncryptWithKey(
      userPrivateKey,
      nonce,
      password.byteArray
    );
    //store encrypted keys to user account
    Meteor.call("updatePrivateKey", privateKey, password.randomBytes, nonce);
  }*/
};

export default svEnc;
