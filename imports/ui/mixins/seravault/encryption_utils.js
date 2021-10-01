import nacl from "tweetnacl";
import naclutil from "tweetnacl-util";

const encryption = {
  generate32ByteKeyFromPassword: function (password, randomBytes) {
    //console.log(nacl);
    console.log(password)
    console.log(randomBytes)
    var self = this,
    byteArray = naclutil.decodeUTF8(password);

    if (byteArray.length < 32) {
      // if there are no randomBytes provided -> generate some
      if (!randomBytes) {
        randomBytes = nacl.randomBytes(32 - byteArray.length);
      }
      // store the random bytes so we can use them again when we want to decrypt
      byteArray = self.appendBuffer(byteArray, randomBytes);

    } else {
      byteArray = byteArray.slice(0, 31);
    }
    // return the byte array and the added bytes
    return {
      byteArray: byteArray,
      randomBytes: randomBytes
    };
  },

  appendBuffer(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.length + buffer2.length);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.length);
    return tmp;
  },
  symEncryptWithKey: function(message, nonce, key) {

    var returnAsString = message instanceof String;
    if (returnAsString) {
      message = naclutil.decodeUTF8(message);
    }
    var encryptedMessage = nacl.secretbox(message, nonce, key);
    if (returnAsString) {
      return naclutil.encodeBase64(encryptedMessage);
    }
    return encryptedMessage;
  },
  symDecryptWithKey: function(cipher, nonce, key) {    
    console.log('CIPHER', cipher);
    console.log('NONCE', nonce);
    console.log('KEY', key);
    try {
      var returnAsString = cipher instanceof String;
      if (returnAsString) {
        cipher = naclutil.decodeBase64(cipher);
      }
      var decryptedMessage = nacl.secretbox.open(cipher, nonce, key);
      if (returnAsString) {
        return naclutil.encodeUTF8(decryptedMessage);
      }
      return decryptedMessage;
    } catch (err) {
      return err;
    }
  },

  asymEncryptWithKey: function(message, nonce, publicKey, secretKey) {
    return nacl.box(message, nonce, publicKey, secretKey);
  },
  /**
   * decrypts the given message asymmetrically with the given (private) key
   * @param message - the message to be decrypted
   * @param nonce - the nonce used for the decryption
   * @param publicKey - the public key that represents the message
   * @param secretKey - the private key of the user that wants to decrypt the message
   */
  asymDecryptWithKey: function(message, nonce, publicKey, secretKey) {
    return nacl.box.open(message, nonce, publicKey, secretKey);
  },

  generateKeyPair() {
    return nacl.box.keyPair();
  },
  generateNonce() {
    return nacl.randomBytes(secretbox.nonceLength);
  },
  generateKey() {
    return encodeBase64(nacl.randomBytes(secretbox.keyLength));
  },
  generate24ByteNonce: function() {
    return nacl.randomBytes(24);
  },
  generate16ByteNonce: function() {
    return nacl.randomBytes(16);
  },
  generateRandomKey: function() {
    return nacl.randomBytes(32);
  },
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  },
  
  str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },
};

export default encryption;
