<template>
  <div class="app-container log-add-container">
    <el-card v-loading="loading" class="box-card">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        style="margin-top: 20px"
        class="dialog-form"
      >
        <el-row :gutter="20">
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="日志时间" prop="createDate">
              <el-date-picker
                v-model="ruleForm.createDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日志时间"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="天气状态" prop="weather">
              <el-select v-model="ruleForm.weather" placeholder="请选择天气状态">
                <el-option v-for="item in weatherList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="防火等级" prop="level">
              <el-select v-model="ruleForm.level" placeholder="请选择防火等级">
                <el-option v-for="item in dutyLevelList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="带班领导" prop="leader">
              <el-select v-model="ruleForm.leader" placeholder="请选择带班领导">
                <el-option v-for="item in leaderList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="值班人员" prop="user">
              <el-select v-model="ruleForm.user" placeholder="请选择值班人员">
                <el-option v-for="item in workerList" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-for="item in dynamicForm" :key="item.prop" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-input v-model="ruleForm[item.prop]" maxlength="20" v-bind="item.attrs || {}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="no-limit-whdth" label="日志内容" prop="content">
          <!-- <quillEditor ref="quillEditor" v-model="ruleForm.content" :options="editorOption" /> -->
          <RichTextEditor v-model="ruleForm.content" />
          <!-- <el-upload
            class="uploader"
            accept="image/*"
            action=""
            multiple
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload> -->
        </el-form-item>
        <el-row :gutter="20">
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="上传图片">
              <el-upload
                class="img-uploader"
                accept="image/*"
                action=""
                multiple
                drag
                :before-upload="beforeUpload"
                :http-request="handleUpload"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text" style="line-height: 1.5">
                  将文图片拖到此处，
                  <div>或<em>点击上传</em></div>
                </div>
                <div slot="tip" class="el-upload__tip">
                  {{ `只能上传.png/.jpg/.jpeg等格式图片，且单张不超过${limit}M` }}
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import RichTextEditor from '@/components/RichTextEditor'
// import * as Quill from 'quill'
// import imageResize from 'quill-image-resize-module'
// import { ImageDrop } from 'quill-image-drop-module'
// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', imageResize)
// import { quillEditor } from 'vue-quill-editor'
import { FireApi, CommonApi, TemplateApi } from '@/api'

// const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
//   ['blockquote', 'code-block'], // 引用，代码块
//   [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
//   [{ list: 'ordered' }, { list: 'bullet' }], // 列表
//   [{ script: 'sub' }, { script: 'super' }], // 上下标
//   [{ indent: '-1' }, { indent: '+1' }], // 缩进
//   [{ direction: 'rtl' }], // 文本方向
//   [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
//   [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
//   [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
//   [{ font: [] }], // 字体
//   [{ align: [] }], // 对齐方式
//   ['clean'] // 清除字体样式
//   // ['image'] // 链接、图片、视频
// ]

export default {
  components: {
    // quillEditor,
    RichTextEditor
  },
  data() {
    return {
      rules: {
        // leader: [
        //   { required: true, message: '请选择带班领导', trigger: 'change' }
        // ],
        // level: [
        //   { required: true, message: '请选择防火等级', trigger: 'change' }
        // ],
        // weather: [
        //   { required: true, message: '请选择天气状况', trigger: 'change' }
        // ],
        // user: [
        //   { required: true, message: '请选择值班人员', trigger: 'change' }
        // ],
        // content: [
        //   { required: true, message: '请填写日志内容', trigger: 'change' }
        // ]
      },
      // 富文本编辑器配置
      // editorOption: {
      //   placeholder: '添加日志',
      //   modules: {
      //     toolbar: {
      //       container: toolbarOptions
      //       // handlers: {
      //       //   image: function(value) {
      //       //     if (value) {
      //       //       // 调用element的图片上传组件
      //       //       document.querySelector('.uploader .el-button').click()
      //       //     } else {
      //       //       this.quill.format('image', false)
      //       //     }
      //       //   }
      //       // }
      //     }, // 自定义工具栏，与上面定义的toolbarOptions 相对应
      //     // 新增下面
      //     imageDrop: true, // 拖动加载图片组件。
      //     imageResize: {
      //       // 调整大小组件。
      //       displayStyles: {
      //         backgroundColor: 'black',
      //         border: 'none',
      //         color: 'white'
      //       },
      //       modules: ['Resize', 'DisplaySize', 'Toolbar']
      //     }
      //     // keyboard: {
      //     //   bindings
      //     // }
      //   },
      //   theme: 'snow' // 主题
      // },
      weatherList: [],
      dutyLevelList: [],
      leaderList: [],
      workerList: [],
      logContent: '',
      ruleForm: {
        id: '',
        createDate: '',
        content: '', // 富文本编辑器默认内容
        leader: '',
        level: '',
        user: '',
        weather: '',
        templateId: ''
      },
      fireStreetFiles: [],
      limit: 5,
      dynamicForm: [],
      loading: false
    }
  },
  async created() {
    const { id } = this.$route.query
    this.ruleForm.id = id || ''
    await this.getTemplateForm()
    this.getLogDetail()
    this.getWeather()
    this.getDutyLevel()
    this.getLeader()
    this.getWorker()
  },
  methods: {
    async getTemplateForm() {
      const { data, code } = await TemplateApi.getTemplateForm()
      if (code === 0) {
        this.dynamicForm = data.form
        data.form.forEach((item) => {
          this.$set(this.ruleForm, item.prop, '')
        })
      }
    },
    async getWeather() {
      const { data, code } = await FireApi.getWeather()
      code === 0 && (this.weatherList = data)
    },
    async getDutyLevel() {
      const { data, code } = await FireApi.getDutyLevel()
      code === 0 && (this.dutyLevelList = data)
    },
    async getLeader() {
      const { data, code } = await FireApi.getLeader()
      code === 0 && (this.leaderList = data)
    },
    async getLogDetail() {
      this.loading = true
      const { data, code } = await FireApi.getLogDetail(this.ruleForm.id).catch(() => {
        this.loading = false
      })
      if (code === 0) {
        const { createDate, content, leader, level, user, weather, templateId, extraProperties } = data
        this.ruleForm = {
          ...this.ruleForm,
          createDate: createDate || '',
          content: content || '',
          leader: leader || '',
          level: level || '',
          user: user || '',
          weather: weather || '',
          templateId: templateId || '',
          ...(extraProperties || {})
        }
      }
      this.loading = false
    },
    async getWorker() {
      const { data, code } = await FireApi.getWorker()
      code === 0 && (this.workerList = data)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.updateFireLog()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeUpload(file) {
      var fileSize = file.size / (1024 * 1024)
      if (fileSize > this.limit) {
        this.$message.error(`文件大小不能超过${this.limit}M`)
        return false
      } else {
        return true
      }
    },
    async handleUpload({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      const { data, code } = await CommonApi.upload(formData)

      if (code === 0) {
        this.fireStreetFiles.push({
          fileName: file.name,
          fileUrl: data
        })

        // // 获取富文本组件实例
        // const quill = this.$refs.quillEditor.quill

        // const length = quill.getSelection().index
        // // 插入图片，res为服务器返回的图片链接地址
        // quill.insertEmbed(length, 'image', data)
        // // 调整光标到最后
        // quill.setSelection(length + 1)
      } else {
        // 提示信息，需引入Message
        this.$message.error('图片插入失败！')
      }
    },

    async updateFireLog() {
      let { createDate } = this.ruleForm
      if (createDate.length < 19) {
        createDate += ' 00:00:00'
      }

      const ruleForm = { ...this.ruleForm }

      const extraProperties = {}
      this.dynamicForm.forEach((item) => {
        extraProperties[item.prop] = ruleForm[item.prop]
        delete ruleForm[item.prop]
      })

      const params = {
        ...ruleForm,
        createDate,
        extraProperties,
        fireStreetFiles: this.fireStreetFiles
      }
      const { code } = await FireApi.updateFireLog(params)
      if (code === 0) {
        this.visible = false
        this.$message.success('修改日志成功！')
        this.$router.go(-1)
      } else {
        this.$message.error('修改日志失败！')
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.uploader {
  display: none;
}
.log-add-container {
  ::v-deep .ql-toolbar {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  ::v-deep .ql-container {
    height: 480px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    overflow-y: auto;
  }
}

.img-uploader {
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
