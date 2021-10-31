<template>
  <div>
    <v-file-input
      chips
      multiple
      show-size
      counter
      label="Attach files"
      v-model="internalValue"
      v-on:change="$emit('change', $event)"
    ></v-file-input>
  </div>
</template>

<script lang="js">
import { VFileInput } from 'vuetify/lib'

 export default {
    data () {
      return {
        internalValue: this.value
      }
    },
    components: {
      VFileInput
    },
    props: {
      value: Array
    }
  }
</script>