<template>
  <div>
    <v-toolbar>
      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().toggleBold().run()" :outlined="editor && editor.isActive('bold')" v-bind="attrs"
            v-on="on">
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-bold")}}</span>
      </v-tooltip>
      
      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().toggleItalic().run()" :outlined="editor && editor.isActive('italic')" v-bind="attrs"
            v-on="on">
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-italic")}}</span>
      </v-tooltip>

      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().toggleStrike().run()" :outlined="editor && editor.isActive('strike')" v-bind="attrs"
            v-on="on">
          <v-icon>mdi-format-strikethrough-variant</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-strikethrough")}}</span>
      </v-tooltip>

      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().toggleCode().run()" :outlined="editor && editor.isActive('code')" v-bind="attrs"
            v-on="on">
          <v-icon>mdi-xml</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-code")}}</span>
      </v-tooltip>

      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().unsetAllMarks().run()"  v-bind="attrs"
            v-on="on">
          <v-icon>mdi-format-clear</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-removeformatting")}}</span>
      </v-tooltip>

      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().setParagraph().run()"  :outlined="editor && editor.isActive('paragraph')" v-bind="attrs"
            v-on="on">
          <v-icon>mdi-format-paragraph</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-paragraph")}}</span>
      </v-tooltip>

      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().undo().run()" v-bind="attrs"
            v-on="on">
          <v-icon>arrow-u-left-bottom-bold</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-undo")}}</span>
      </v-tooltip>

      <v-tooltip top >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small @click="editor.chain().focus().redo().run()" v-bind="attrs"
            v-on="on">
          <v-icon>marrow-u-right-bottom-bold</v-icon>
        </v-btn>
        </template>
        <span>{{ $t("format-redo")}}</span>
      </v-tooltip>


      <!--
      <v-btn icon small  @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
        paragraph
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        h1
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        h2
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        h3
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        h4
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        h5
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        h6
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        bullet list
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        ordered list
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
        code block
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        blockquote
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </v-btn>
      <v-btn icon small  @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </v-btn>
         
      -->
    </v-toolbar>
    <v-card>
      <editor-content :editor="editor" />
    </v-card>
  </div>
</template>

<script lang="js">
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'

export default {
  name: "wysiwyg",
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    content: null
  },

  data() {
    return {
      editor: null      
    }
  },
  methods: {
    runAction(action) {
      var editor = this.editor
      console.log(editor)
      var f=new Function (action);
      f()
    }
  },
  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
      ],
      content: this.modelValue,
      onUpdate: () => {
        // HTML
        this.$emit('update:modelValue', this.editor.getHTML())

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
</style>