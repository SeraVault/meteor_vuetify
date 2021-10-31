<template>
  <quill-editor
    ref="myQuillEditor"
    v-model="html"
    :options="editorOption"
    v-on:change="$emit('change', $event)"
  />

</template>

<script type="js">
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'

  export default {
    data () {
      return {
        html: this.content,
        editorOption: {
          placeholder: ""
        }
      }
    },
    props: {
      content: String
    },
    components: {
      quillEditor
    }
  }

</script>

<style scoped type="css">

.ql-toolbar.ql-snow {
    background-color: #1CD777 !important
}
</style>