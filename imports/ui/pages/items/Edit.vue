<template>
  <v-card>
    {{item._id}}
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-text-field label="Title" v-model="item.contents.title"/>
      <v-textarea label="Content" v-model="item.contents.message"/>
      <wysiwyg :content="item.contents.html" @change="item.contents.html = $event.html"/>
      <credit-card-number :value="item.contents.ccno" @change="item.contents.ccno = $event"/>
      <credit-card-validation :value="item.contents.ccv" @change="item.contents.ccv = $event"/>
      <file-upload :value="fileUploads" @change="fileUploads = $event"/>
      <!--<v-list v-for="file in filesSaved" :key="file._id">
        <v-list-item-content>{{file.name}}</v-list-item-content>
      </v-list>-->
      <v-text-field label="String" v-model="item.contents.string"/>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="save">{{ buttonSave }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="js">
  import sv from '../../mixins/seravault/encryption'
  import { Items } from '../../../api/collections/items/_client'
  import { Files } from '../../../api/collections/files/shared'
  import { Random } from 'meteor/random'
  import Wysiwyg from '../../components/fields/Quill.vue'
  import CreditCardNumber from '../../components/fields/CreditCardNumber.vue'
  import CreditCardValidation from '../../components/fields/CreditCardCCV.vue'
  import FileUpload from '../../components/fields/Files.vue'
  export default {
    data: function() {
      return {
        item: {
          contents: {
            title: null,
            message: null,
            html: null,
            string: null,
            ccno: null,
            ccv: null,
            files: []           
          },
          recipients: []
        },
        title: "",
        buttonSave: "",
        fileUploads: [],
        filesSaved: []
      };
    },
    components: {
      Wysiwyg,
      CreditCardNumber,
      CreditCardValidation,
      FileUpload
    },
    meteor: {      
      async loadItem() {        
          if (this.$route.params._id){                           
            var encryptedItem = Items.findOne(this.$route.params._id)            
            if (encryptedItem) {
              this.item = await sv.decryptItem(encryptedItem, await this.getUserPrivateKey() )
            }            
            this.title = this.$i18n.t('seravault.items.EditItem')
            this.buttonSave = this.$i18n.t('buttons.update')
            
          } else {              
            this.item._id = Random.id()
            this.title = this.$i18n.t('seravault.items.AddItem')
            this.buttonSave = this.$i18n.t('buttons.add')
          }

          if (this.item.contents.files) {
            this.filesSaved = Files.find({_id: {$in: this.item.contents.files}})
          }
      }
    },
    methods: {
      async save() {
        var item = this.item        
        var user = Meteor.user()
        var contacts = [{userId: user._id, publicKey: user.profile.publicKey}]             
        const itemEncrypted = await sv.encryptItem(item, contacts)
        
        //item.contents.files = await this.uploadFiles(item._id)  
        if (this.$route.params._id)      
          Meteor.call('items.upsert', itemEncrypted)
        else 
          Meteor.call('items.insert', itemEncrypted)

        this.$router.push({name: "itemList"})     
      },

      uploadFiles(itemEncrypted) {
        if (this.fileUploads.length > 0) {
          const key = sv.generateAesKey()
          var fileArray = []
          console.log(this.fileUploads[0])
          console.log(Files)
          var uploadInstance = Files.insert({
            file: this.fileUploads[0],
            chunkSize: 'dynamic',
            meta: {itemId: itemEncrypted._id}
          }, false);

          uploadInstance.on('start', function() {
            console.log(this);
          });

          uploadInstance.on('data', async function(data) {
            console.log('key', key)
            const dataEncrypted = await sv.encryptFileChunk(key, data)
            console.log(dataEncrypted)
            return dataEncrypted
          })

          uploadInstance.on('end', function(error, fileObj) {
            
            if (error) {
              window.alert('Error during upload: ' + error.reason);
            } else {
              fileArray.push({fileId: fileObj._id, key })
              return fileArray
            }
            console.log("done")
          });

          uploadInstance.start();
          
        }
      },
      getUserPrivateKey: function() {
        var privateKey = sv.getUserPrivateKeyObject(this.$store.state.privateKey)      
        return privateKey
      },
      tmp(value) {
        console.log(value)
      }
    }
  }
</script>