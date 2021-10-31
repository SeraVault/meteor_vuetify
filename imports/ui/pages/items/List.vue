<template>
  <div>
    <v-row>
      <v-col>
        <v-card
          class="pa-2"
          v-for="item in decryptedItems"
          v-bind:key="item._id"
        >
          <div v-if="isObject(item.contents)">
            <v-card-title>{{ item.contents.title }}</v-card-title>
            <v-card-text>{{ item.contents.message }}</v-card-text>
          </div>
          <div v-if="!isObject(item.contents)">
            <v-card-text>
              {{ item }}
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
//import { DecryptedItems, ItemsDecrypted } from '../../../api/collections/items/decryptedItems'
import { Items } from '../../../api/collections/items/_client'
import { mapState } from 'vuex'

var DecryptedItems = new Mongo.Collection(null);

export default {
  data() {
    return {
      password: null,
      message: null,
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
  meteor: {
    $subscribe: {
        "items.get.all": []
    },
    userId() {
      return Meteor.userId;
    },
    items() {
      return Items.find()
    },
    decryptedItems() {
      return DecryptedItems.find()
    }
  },
  watch: {

  },
  computed: {

  },
  activated() {
    var vm = this
    
    Items.find().observe({
      added: async function(item){
        var privateKey = await vm.getUserPrivateKey()
        DecryptedItems.insert(await sv.decryptItem(item, privateKey))
        console.log('groups observe added value function');
      },
      changed: async function(item){
        console.log('item changed:', item)
        var privateKey = await vm.getUserPrivateKey()
        DecryptedItems.update({_id: item._id}, await sv.decryptItem(item, privateKey))
        console.log('groups observe changed value function');
      },
      removed:function(document){
        console.log('groups observe removed value function');
      }
  });
  }

}
</script>
