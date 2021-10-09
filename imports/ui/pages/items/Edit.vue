<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-text-field label="Title" v-model="item.contents.title"/>
      <v-textarea label="Content" v-model="item.contents.message"/>

    </v-card-text>
    <v-card-actions>
      <v-btn @click="save">{{ buttonSave }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="js">
  import sv from '../../mixins/seravault/encryption'
  import { Items } from '../../../api/collections/items/shared'
  export default {
    data: function() {
      return {
        item: {},
        title: "",
        buttonSave: ""
      };
    },
    meteor: {      
      async loadItem() {
          if (this.$route.params._id){        
            var encryptedItem = Items.findOne(this.$route.params._id)            
            if (encryptedItem) {
              this.item = await sv.decryptItem(encryptedItem, this.$store.state.privateKey)
            }
            this.title = this.$i18n.t('seravault.EditItem')
            this.buttonSave = this.$i18n.t('buttons.update')
          } else {
            
            this.item = {contents : {
              title: null,
              message: null      
            }}
            this.title = this.$i18n.t('seravault.AddItem')
            this.buttonSave = this.$i18n.t('buttons.add')
          }
      }
    },
    methods: {
      async save() {
        var item = this.item               
        var user = Meteor.user()
        var contacts = [{userId: user._id, publicKey: user.profile.publicKey}]       
        itemEncrypted = await sv.encryptItem(item, contacts)    
        console.log('save:', itemEncrypted)         
        Meteor.call('items.upsert', itemEncrypted)        
        
      }
    },
    created: async function() {    
      
    }
  }
</script>


</template>