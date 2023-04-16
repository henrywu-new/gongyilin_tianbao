<template>
  <div class="rich-text-editor-wrap">
    <Toolbar style="border-bottom: 1px solid #dcdfe6" :editor="editor" :default-config="toolbarConfig" :mode="mode" />
    <Editor
      v-model="html"
      style="height: 500px; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="mode"
      @onChange="onChange"
      @onCreated="onCreated"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

export default Vue.extend({
  components: { Editor, Toolbar },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      html: '',
      toolbarConfig: { excludeKeys: ['insertLink', 'codeBlock', 'insertVideo', 'group-image', 'fullScreen'] },
      editorConfig: { placeholder: '添加日志' },
      mode: 'simple' // or 'simple'
    }
  },
  watch: {
    value(newVal) {
      this.html = newVal
    }
  },
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onChange() {
      this.$emit('input', this.html)
    }
  }
})
</script>
<style lang="scss" scoped>
.rich-text-editor-wrap {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  overflow: hidden;
}
</style>
