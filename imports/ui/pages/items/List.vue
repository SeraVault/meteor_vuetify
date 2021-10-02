<template>
  <div>
    <v-row>
      <v-col>
        <v-card class="pa-2" v-for="item in items" v-bind:key="item._id">
          <div v-if="isObject(item.contents)">
          <v-card-title>{{ item.contents.title }}</v-card-title>
          <v-card-text>{{ item.contents}}</v-card-text>
          
          </div>
          <div v-if="!isObject(item.contents)">
            <v-card-text>
            {{item.contents}}
            </v-card-text>
            </div>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn color="error" fab dark large absolute bottom right @click="add">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>
<script lang="js">
import encryption from '../../mixins/seravault/encryption'
import { Items } from '../../../api/collections/items/_client'

export default {
  data() {
    return {
      password: null,
      message: null
    };
  },
  methods: {
    ...encryption,
    add: function() {
      this.$router.push({ name: "itemEdit" });
    },
    isObject: function(obj) {
      return obj !== undefined && obj !== null && obj.constructor == Object;
    }
  },
  meteor: {
    userId() {
      return Meteor.userId;
    },
    $subscribe: {
      "items.get.all": []
    },
    items() {
      var items = Items.find();
      return items;
      return items.forEach(item => this.decryptItemAES(item, this.$store.state.privateKey))
    }
  }
};
</script>
