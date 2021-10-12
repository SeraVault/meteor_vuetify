//import nacl from "tweetnacl";
import Chance from "chance";
//import svUtils from "./encryption_utils.js";

import { Keys } from "../../../api/collections/keys/shared"
import WebCrypto from 'easy-web-crypto'


const svEnc = {
  async initUser(passphrase, displayName) {
    //geneate key pair
    //encrypt with user password
    //update user profile with encrypted keys

    const chance = new Chance();

    //Generate user's Async KeyPair
    const keyPair = await WebCrypto.genKeyPairRSA()
    const privateKey = await WebCrypto.exportPrivateKeyRSA(keyPair.privateKey);
    const publicKey = await WebCrypto.exportPublicKeyRSA(keyPair.publicKey);
    const encMasterKey = await WebCrypto.genEncryptedMasterKey(passphrase);    
    const masterKey = await WebCrypto.decryptMasterKey(passphrase, encMasterKey)
    const privateKeyCipher = await WebCrypto.encrypt(masterKey, privateKey)
    
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
    const masterKey = await WebCrypto.decryptMasterKey(passphrase, encMasterKey)    
    var privateKey = await WebCrypto.decrypt(masterKey, privateKeyCipher)   
    return privateKey
  },

  async getUserPrivateKeyObject(privateKey) {
    privateKeyObject = await WebCrypto.importPrivateKeyRSA(privateKey); 
    return privateKeyObject
  },

  async encryptItem(item, contacts) {    
    const key = await WebCrypto.genAESKey(extractable = true, mode = 'AES-GCM', keySize = 256)    
    const exportedKey = await WebCrypto.exportKey(key)      
    item.contents = await WebCrypto.encrypt(key, item.contents)    
    item.recipients = [Meteor.userId()]
    contacts.forEach(async contact => {
      const userPublicKey = await WebCrypto.importPublicKeyRSA(contact.publicKey)       
      const encryptedKey =  await WebCrypto.encryptRSA(userPublicKey, exportedKey)
      const data = {itemId: item._id, userId: contact.userId, key: encryptedKey }      
      Meteor.call('keys.upsert', data )           
    })    
    return item
  },

  async decryptItem(item, privateKey) {      
    var keyData = Keys.findOne({itemId: item._id, userId: Meteor.userId()}) 
    const aesKey = await WebCrypto.decryptRSA(privateKey, keyData.key)
    console.log('aesKey', aesKey)
    //const imported = WebCrypto.import(aesKey)    
    const importedAesKey = await WebCrypto.importKey(Object.values(aesKey))    
    console.log(importedAesKey)
    item.contents = await WebCrypto.decrypt(importedAesKey, item.contents) 
    console.log('decrypt', item)   
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
