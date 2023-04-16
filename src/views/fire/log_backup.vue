<template>
  <div class="app-container">
    <el-button
      type="primary"
      style="margin-bottom: 20px"
      @click="showDialog"
    >添加消防日志</el-button>
    <el-table :data="logList" style="width: 100%">
      <el-table-column prop="createDate" label="创建日期" width="140" />
      <el-table-column prop="updateDate" label="更新日期" width="140" />
      <el-table-column prop="weather" label="天气状况" width="120" />
      <el-table-column prop="level" label="防火等级" width="120" />
      <el-table-column prop="leader" label="带班领导" width="120" />
      <el-table-column prop="user" label="值班人员" />
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="showDialog2(scope.row)">
            查看日志
          </el-button>
          <!-- <el-button type="warning" plain @click="showDialog(2, scope.row)">
            修改
          </el-button> -->
          <!-- <el-button plain @click="showDialog(2, scope.row)"> 打印 </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 20px">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="size"
        :total="total"
        @current-change="onPageChange"
      />
    </div>
    <el-dialog title="添加消防日志" :visible.sync="visible" width="50%" center>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="dialog-form"
      >
        <el-form-item label="天气状态" prop="weather">
          <el-select v-model="ruleForm.weather" placeholder="请选择天气状态">
            <el-option
              v-for="item in weatherList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="防火等级" prop="level">
          <el-select v-model="ruleForm.level" placeholder="请选择防火等级">
            <el-option
              v-for="item in dutyLevelList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="带班领导" prop="leader">
          <el-select v-model="ruleForm.leader" placeholder="请选择带班领导">
            <el-option
              v-for="item in leaderList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="值班人员" prop="user">
          <el-select v-model="ruleForm.user" placeholder="请选择值班人员">
            <el-option
              v-for="item in workerList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="no-limit-whdth" label="日志内容" prop="content">
          <quillEditor
            ref="quillEditor"
            v-model="ruleForm.content"
            :options="editorOption"
          />
          <el-upload
            class="uploader"
            accept="image/*"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="handleUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      class="print-dialog"
      title="消防日志详情"
      :visible.sync="visible2"
      width="60%"
      center
    >
      <div id="pdfDom" v-html="logContent" />
      <template slot="footer">
        <div class="no-print" style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="handlePrint"> 打印 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as Quill from 'quill'
import imageResize from 'quill-image-resize-module'
import { ImageDrop } from 'quill-image-drop-module'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', imageResize)
import { quillEditor } from 'vue-quill-editor'
import { FireApi, CommonApi } from '@/api'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'], // 引用，代码块
  [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ list: 'ordered' }, { list: 'bullet' }], // 列表
  [{ script: 'sub' }, { script: 'super' }], // 上下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ direction: 'rtl' }], // 文本方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  [{ font: [] }], // 字体
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除字体样式
  ['image'] // 链接、图片、视频
]
export default {
  name: 'User',
  components: {
    quillEditor
  },
  data() {
    return {
      visible: false,
      visible2: false,
      rules: {
        leader: [
          { required: true, message: '请选择带班领导', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择防火等级', trigger: 'change' }
        ],
        weather: [
          { required: true, message: '请选择天气状况', trigger: 'change' }
        ],
        user: [
          { required: true, message: '请选择值班人员', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写日志内容', trigger: 'change' }
        ]
      },
      // 富文本编辑器配置
      editorOption: {
        placeholder: '请输入消防日志',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                console.log('点击了')
                if (value) {
                  // 调用element的图片上传组件
                  document.querySelector('.uploader .el-button').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }, // 自定义工具栏，与上面定义的toolbarOptions 相对应
          // 新增下面
          imageDrop: true, // 拖动加载图片组件。
          imageResize: {
            // 调整大小组件。
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
          // keyboard: {
          //   bindings
          // }
        },
        theme: 'snow' // 主题
      },
      page: 1,
      size: 20,
      total: 0,
      logList: [],
      weatherList: [],
      dutyLevelList: [],
      leaderList: [],
      workerList: [],
      logContent: '',
      ruleForm: {
        content: '', // 富文本编辑器默认内容
        leader: '',
        level: '',
        user: '',
        weather: ''
      },
      fireStreetFiles: [],
      limit: 5
    }
  },
  created() {
    this.getLogList()
    this.getWeather()
    this.getDutyLevel()
    this.getLeader()
    this.getWorker()
  },
  methods: {
    async getLogList() {
      const { page, size } = this
      const { data, code } = await FireApi.getLogList({ page, size })
      if (code === 0) {
        this.logList = data.list
        this.total = data.total
        console.log('=========>', this.total)
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
    async getFireSystemInfo(id) {
      const { data, code } = await FireApi.getFireSystemInfo(id)
      code === 0 && (this.fireSystemInfoList = data)
    },
    async getWorker() {
      const { data, code } = await FireApi.getWorker()
      code === 0 && (this.workerList = data)
    },
    onPageChange(page) {
      this.page = page
      this.getLogList()
    },
    handleAvatarSuccess() {},
    beforeAvatarUpload(file) {
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

        // 获取富文本组件实例
        const quill = this.$refs.quillEditor.quill

        const length = quill.getSelection().index
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, 'image', data)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        // 提示信息，需引入Message
        this.$message.error('图片插入失败！')
      }
    },

    showDialog() {
      this.visible = true
    },
    showDialog2(row) {
      const { content } = row
      this.logContent = content
      localStorage.setItem('firelog', content)
      this.$router.push({ path: '/print' })
      // this.visible2 = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.addFireLog()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    async addFireLog() {
      const params = {
        ...this.ruleForm,
        fireStreetFiles: this.fireStreetFiles
      }
      const { code } = await FireApi.addFireLog(params)
      if (code === 0) {
        this.visible = false
        this.$message.success('添加日志成功！')
        this.getLogList()
      } else {
        this.$message.error('添加日志失败！')
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
</style>
