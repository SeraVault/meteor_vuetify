<template>
  <editor-content :editor="editor" />
</template>

<script lang="js">
  import { Editor, EditorContent } from 'tiptap'

  export default {
    name: "wysiwyg",
    components: {
      EditorContent,
    },
    data() {
      return {
        editor: null,
      }
    },
    mounted() {
      this.editor = new Editor({
        content: "",
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>