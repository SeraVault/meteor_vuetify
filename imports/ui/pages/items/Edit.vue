<template>
  <v-card>
    {{ item._id }}
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-text-field label="Title" v-model="item.contents.title" />
      <v-textarea label="Content" v-model="item.contents.message" />
      <wysiwyg
        :content="item.contents.html"
        @change="item.contents.html = $event.html"
      />
      <credit-card-number
        :value="item.contents.ccno"
        @change="item.contents.ccno = $event"
      />
      <credit-card-validation
        :value="item.contents.ccv"
        @change="item.contents.ccv = $event"
      />
      <file-upload :value="fileUploads" @change="fileUploads = $event" />
      <v-list v-for="file in item.contents.files" :key="file.id">
        <v-list-item-content>Name: {{file.name}}</v-list-item-content>
      </v-list>
      <v-text-field label="String" v-model="item.contents.string" />
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
    
  },
  methods: {
    async save() {
      var item = this.item
      var user = Meteor.user()
      var contacts = [{userId: user._id, publicKey: user.profile.publicKey}]
      if (!item.contents.files) {
        item.contents.files = []
      }
      await this.processFiles()
      const itemEncrypted = await sv.encryptItem(item, contacts)
      
      if (this.$route.params._id)
        Meteor.call('items.upsert', itemEncrypted)
      else
        Meteor.call('items.insert', itemEncrypted)

      this.$router.push({name: "itemList"})
    },
    uploadFile(file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function(fileLoadEvent) {
            const id = Random.id()
            Meteor.call('file-upload', id, reader.result, function(error) {
              if (error) {
                console.log(error)
              }
              else {                                
                const fileMeta = {id: id, name: file.name, lastModified: file.lastModified, size: file.size, type: file.type, key: "key"}                
                resolve(fileMeta)
              }
            })
        }
        reader.onerror = (error) => {
          console.log(error)
        }
        reader.readAsBinaryString(file)       
      })
    },
    processFiles() {
      return new Promise((resolve, reject) => {
        if (!this.item.contents.files) {
          this.item.contents.files = []
        }
        const result = this.fileUploads.forEach(async file => {
          const fileMeta = await this.uploadFile(file)
          console.log(fileMeta)
          this.item.contents.files.push(fileMeta)
        })
        resolve(result)
        this.fileUploads = []
      })
    },
    
    getUserPrivateKey() {
      var privateKey = sv.getUserPrivateKeyObject(this.$store.state.privateKey)
      return privateKey
    },
    tmp(value) {
      console.log(value)
    }
  },
  async activated() {
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
      this.item.contents = {}
      this.buttonSave = this.$i18n.t('buttons.add')
    }

    if (this.item.contents.files) {
      this.filesSaved = Files.find({_id: {$in: this.item.contents.files}})
    }
  }
}
</script>
