<template>
  <v-text-field v-mask="'####'" v-model="internalValue" label="CCV" v-on:change="$emit('change', $event)"/>
</template>

<script type="js">
  import { VTextField } from 'vuetify/lib'
0
  export default {
    data () {
      return {
        internalValue: this.value
      }
    },
    components: {
      VTextField
    },
    props: {
      value: String
    }
  }

</script>