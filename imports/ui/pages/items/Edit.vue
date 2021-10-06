<template>
  <v-card>
    <v-card-title>Add Item</v-card-title>
    <v-card-text>
      <v-text-field label="Title" v-model="item.contents.title" v-if="item.contents"/>
      <v-textarea label="Content" v-model="item.contents.message" v-if="item.contents"/>

    </v-card-text>
    <v-card-actions>
      <v-btn @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="js">
  import sv from '../../mixins/seravault/encryption'
  import clientItemUpsert from '../../../api/collections/items/_client'
  import { Items } from '../../../api/collections/items/shared'
  export default {
    data: function() {
      return {
        item: {}
      };
    },
    meteor: {
      $subscribe: {
        "items.get.all": []
      },
      async item() {
          if (this.$route.params._id){        
            var encryptedItem = Items.findOne(this.$route.params._id)            
            if (encryptedItem) {
              this.item = await sv.decryptItem(encryptedItem, this.$store.state.privateKey)
            }
          } else {
            this.item.contents = {
              title: null,
              message: null      
            }
          }
      }
    },
    methods: {
      async save() {
        var item = this.item           
        item = await sv.encryptItem(item, this.$store.state.privateKey)             
        Meteor.call('items.upsert', item)        
      }
    },
    created: async function() {      
    }
  }
</script>


</template>