<template>
  <v-card>
    <v-card-title>Add Item</v-card-title>
    <v-card-text>
      <v-text-field label="Title" v-model="contents.title"/>
      <v-textarea label="Content" v-model="contents.message"/>

    </v-card-text>
    <v-card-actions>
      <v-btn @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="js">
  //import Items from '../../../api/collections/items/_client'

  export default {
    data: function() {
      return {
        contents: {
          title: null,
          message: null      
        }
      };
    },
    methods: {
      save() {
        Meteor.call('items.upsert', {contents: this.contents})
      }
    }
  }
</script>


</template>