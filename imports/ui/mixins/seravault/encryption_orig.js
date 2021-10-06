//import nacl from "tweetnacl";
import Chance from "chance";
//import svUtils from "./encryption_utils.js";
import { Random } from 'meteor/random'
import { Keys } from "../../../api/collections/keys/shared";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const crypto = window && window.crypto || window.msCrypto;

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function getKeyMaterial(password) {
  return window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

async function getPasswordKey(password, salt) {
  const keyMaterial = await getKeyMaterial(password);
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

function generateRsaKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );
}

async function generateAesKey() {
  var keyInfo = {}
  keyInfo.iv = await crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
      iv: keyInfo.iv
    },
    true,
    ["encrypt", "decrypt"]
  );
  keyInfo.key = await exportAesKey(key)
  return keyInfo
}

async function exportPrivateKey(key) {
  console.log(key);
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  console.log(exported);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
  console.log(pemExported);
  return pemExported;
}

async function exportPublicKey(key) {
  console.log(key);
  const exported = await window.crypto.subtle.exportKey("spki", key);
  console.log(exported);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  console.log(pemExported);
  return pemExported;
}

function importPrivateKey(pem) {
  console.log(pem);
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length
  );
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["decrypt"]
  );
}

function importPublicKey(pem) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["encrypt"]
  );
}


async function exportAesKey(key) {
  const exported = await window.crypto.subtle.exportKey(
    "raw",
    key
  );
  const exportedKeyBuffer = new Uint8Array(exported);
  return exportedKeyBuffer
}

async function importAesKey(rawKey) {  
  const key = await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
  return key
}

function encryptAES(key, iv, message) {
  console.log("key", key);
  console.log("iv", iv);
  console.log("cipher", message);
  return crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
      length: 256
    },
    key,
    message
  );
}

function decryptAES(key, iv, cipher) {
  console.log("key", key);
  console.log("iv", iv);
  console.log("cipher", cipher);
  return crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
      length: 256
    },
    key,
    cipher
  );
}

async function encryptRSA(message) {
  var profile = Meteor.user().profile;
  console.log(profile.publicKey)
  const publicKey = await importPublicKey(profile.publicKey)
  console.log(publicKey)
  return window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    message
  );
}

function decryptRSA(privateKey, ciphertext) {
  return window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    privateKey,
    ciphertext
  );
}

const svEnc = {
  async initUser(password, language, displayName) {
    //geneate key pair
    //encrypt with user password
    //update user profile with encrypted keys

    const chance = new Chance();

    //Generate user's Async KeyPair
    const keyPair = await generateRsaKeyPair();
    const privateKey = await exportPrivateKey(keyPair.privateKey);
    const publicKey = await exportPublicKey(keyPair.publicKey);
    const iv = await crypto.getRandomValues(new Uint8Array(12));
    const salt = await crypto.getRandomValues(new Uint8Array(16));

    console.log("privateKey", privateKey);
    console.log("publicKey", publicKey);

    const keyMaterial = await getKeyMaterial(password);
    const passwordKey = await getPasswordKey(keyMaterial, salt);
    const privateKeyCipher = await encryptAES(
      passwordKey,
      iv,
      encoder.encode(privateKey)
    );

    console.log("privateKeyCipher", privateKeyCipher);
    console.log(
      "privateKeyCipher Decoded",
      arrayBufferToBase64(privateKeyCipher)
    );
    //const base64PrivateKeyCipher = decoder.decode(privateKeyCipher);
    //const base64PublicKey = b64.encode(publicKey);
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
      arrayBufferToBase64(privateKeyCipher),
      publicKey,
      salt,
      iv,
      password.randomBytes,
      sharingCode,
      "free",
      language,
      displayName
    );
    return keyPair.privateKey;
  },

  async getUserPrivateKey(password) {
    var profile = Meteor.user().profile;
    // decrypt private key of the user using his password and nonce
    var privateKeyCipher = base64ToArrayBuffer(profile.privateKeyCipher);
    const keyMaterial = await getKeyMaterial(password);
    const passwordKey = await getPasswordKey(keyMaterial, profile.salt);
    var privateKey = await decryptAES(
      passwordKey,
      profile.iv,
      privateKeyCipher
    );
    privateKey = decoder.decode(privateKey);
    privateKey = await importPrivateKey(privateKey);
    return privateKey;
  },

  async getItemKeyAES(item, privateKey) {    
    const keys = Keys.findOne({ itemId: item._id });

    if (keys == null || item._id == null) {
      item._id = Random.id();
      const keyInfo = await generateAesKey()
      console.log(keyInfo)
      var newKeySet = {};
      newKeySet.userId = Meteor.userId();
      newKeySet.itemId = item._id;
      console.log('keyInfo', keyInfo)
      const keyInfoStr = JSON.stringify(keyInfo);
      console.log('keyInfoStr', keyInfoStr)
      /*newKeySet.encryptedKeyInfo = await encryptRSA(
        encoder.encode(encryptedKeyInfo)
      );*/
      newKeySet.encryptedKeyInfo = keyInfoStr
      
      Keys.insert(newKeySet);

      return { key: keyInfo.key, iv: keyInfo.iv };
    } else {
      const itemKeyInfo = await decryptRSA(
        privateKey,
        key.encryptedKeyInfo
      );
      itemKeyInfo = JSON.parse(itemKeyInfo);
      return { key: itemKeyInfo.key, iv: itemKeyInfo.iv };
    }
  },

  async encryptItemAES(item) {
    const user = Meteor.user();
    const itemKey = await this.getItemKeyAES(item);
    const contents = JSON.stringify(item.contents);

    console.log('itemKey', itemKey)

    item.contents = await encryptAES(
      itemKey.key,
      itemKey.iv,
      ab2str(contents)
    );
    item.recipients = item.recipients || [user._id];

    return item;
  },

  async decryptItemAES(item, privateKey) {
    const itemKey = await this.getItemKeyAES(item, privateKey);
    const key = await importAesKey(itemKey.key)   
    debugger 
    item.contents = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: itemKey.iv,
        length: 256
      },
      key,
      str2ab(item.contents)
    );

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
