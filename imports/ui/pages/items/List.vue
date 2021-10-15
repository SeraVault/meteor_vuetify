<template>
  <div>
    <v-row>
      <v-col>
        <v-card class="pa-2" v-for="item in decryptedItems" v-bind:key="item._id">          
          <div v-if="isObject(item.contents)">
            <v-card-title>{{ item.contents.title }}</v-card-title>
            <v-card-text>{{ item.contents.message}}</v-card-text>
          </div>
          <div v-if="!isObject(item.contents)">
            <v-card-text>
            {{item.contents}}
            </v-card-text>
            </div>
          <v-card-actions>
            <v-btn @click="edit(item._id)">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn color="error" fab dark fixed large bottom right @click="add">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>
<script lang="js">
import sv from '../../mixins/seravault/encryption'
import { Items } from '../../../api/collections/items/_client'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      password: null,
      message: null
    };
  },
  methods: {    
    add: function() {
      this.$router.push({ name: "itemEdit" });
    },
    isObject: function(obj) {
      return obj !== undefined && obj !== null && obj.constructor == Object;
    },
    edit: function(id) {
      this.$router.push({ name: 'itemEdit', params: { _id: id } })
    },
    getUserPrivateKey: function() {
      var privateKey = sv.getUserPrivateKeyObject(this.$store.state.privateKey)      
      return privateKey
    }
  },
  computed: {
    //...mapState(['privateKey'])
  },
  meteor: {
    userId() {
      return Meteor.userId;
    },    
    decryptedItems() {
      var encryptedItems = Items.find();  
      var decryptedItems = []
      encryptedItems.forEach(async item => {
        const privateKey = await sv.decryptItem(item, await this.getUserPrivateKey() )
        decryptedItems.push( item )        
      })          
      return decryptedItems
    }    
  }
};
</script>
