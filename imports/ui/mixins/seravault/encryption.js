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
    return privateKey;
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
  
  async generateAesKey() {
    return await WebCrypto.genAESKey(extractable = true, mode = 'AES-GCM', keySize = 256) 
  },

  async encryptItem(item, contacts) {        
    const key = await this.generateAesKey() 
    const exportedKey = await WebCrypto.exportKey(key)      
    item.contents = await WebCrypto.encrypt(key, item.contents)    
    item.keys = []  
    for (let contact in contacts) {      
      const userPublicKey = await WebCrypto.importPublicKeyRSA(contacts[contact].publicKey)       
      const encryptedKey =  await WebCrypto.encryptRSA(userPublicKey, exportedKey)      
      item.keys.push({userId: contacts[contact].userId, key: encryptedKey})        
    }
    return item
  },
  
  async encryptFileChunk(aesKey, chunk) {
    return await WebCrypto.encrypt(aesKey, chunk)
  },

  async decryptItem(item, privateKey) {  
    //console.log(item)          
    var keyData = item.keys.filter(key => {
      return key.userId == Meteor.userId()
    })
    const myKeyData = keyData[0]
    const aesKey = await WebCrypto.decryptRSA(privateKey, myKeyData.key)
    const importedAesKey = await WebCrypto.importKey(Object.values(aesKey))    
    item.contents = await WebCrypto.decrypt(importedAesKey, item.contents) 
    return item
  },

  async changePassphrase(oldPassphrase, newPassphrase, encMasterKey) {
    try {     
      return await WebCrypto.updatePassphraseKey(oldPassphrase, newPassphrase, encMasterKey)      
    }
    catch (error) {
      return {error: true, message: error}
    }
  }
};

export default svEnc;
