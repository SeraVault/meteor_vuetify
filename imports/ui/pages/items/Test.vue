<template>
  <v-card>
    <v-card-title>TESTING</v-card-title>
    <v-card-text>

      <v-textarea label="Content" v-model="content"/>
      <v-btn @click="rsaEncrypt">RSA Encrypt</v-btn>
      <br/>
      {{ content_rsa_encrypted }}
      <v-btn @click="rsaDecrypt">RSA Decrypt</v-btn>
      {{ content_rsa_decrypted }}

    </v-card-text>
    <v-card-actions>
      
    </v-card-actions>
  </v-card>
</template>

<script lang="js">

/*SERAVAULT START*/
if (Meteor.isClient) {
  import sv from '../../mixins/seravault/encryption'
  import WebCrypto, { encrypt } from 'easy-web-crypto'
}
/*SERAVAULT END*/

export default {
  name: "meteor-auth-dialog",
  data() {
    return {
      content: null,
      content_rsa_encrypted: null,
      content_rsa_decrypted: null
    }
  },
  methods: {
    async rsaEncrypt() {
      const user = Meteor.user()
      //var contacts = [{userId: user._id, publicKey: user.profile.publicKey}]   
      const publicKey = await WebCrypto.importPublicKeyRSA(user.profile.publicKey)
      this.content_rsa_encrypted = await WebCrypto.encryptRSA(publicKey, this.content)
    },
    async rsaDecrypt() {
      console.log(this.$store.state)
      var privateKey = await this.getUserPrivateKey(this.$store.state.privateKey)
      console.log('privateKey', privateKey)
      this.content_rsa_decrypted = await WebCrypto.decryptRSA(privateKey, this.content_rsa_encrypted)

    },
    getUserPrivateKey: function() {
      var privateKey = sv.getUserPrivateKeyObject(this.$store.state.privateKey)      
      return privateKey
    }
  }
}

</script>