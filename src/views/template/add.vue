<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
        ref="ruleForm"
        class="rule-form"
        :model="ruleForm"
        :rules="rules"
        label-width="160px"
        style="margin-top: 20px"
      >
        <el-row :gutter="20">
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="模板名称" prop="temp_add_templateName">
              <el-input v-model="ruleForm.temp_add_templateName" maxlength="200" placeholder="请输入模板名称" />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="模板备注" prop="temp_add_remark">
              <el-input v-model="ruleForm.temp_add_remark" maxlength="20" placeholder="请输入模板备注" />
            </el-form-item>
          </el-col>
          <el-col v-for="(value, key) in dynamicFormProps" :key="key" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item :label="value" :prop="key">
              <el-input v-model="ruleForm[key]" maxlength="20" :placeholder="`请输入${key}自定义名`" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="上传模板" prop="temp_add_templateUrl">
              <el-upload accept=".doc,.docx" drag action="" :before-upload="beforeUpload" :http-request="handleUpload">
                <i class="el-icon-upload" />
                <div class="el-upload__text" style="line-height: 1.5">
                  将word模板拖到此处，
                  <div>或<em>点击上传</em></div>
                </div>
                <div slot="tip" class="el-upload__tip">{{ `只能上传.doc/.docx文件，且不超过${limit}M` }}</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { TemplateApi } from '@/api'

const ruleForm = {
  temp_add_templateName: '',
  temp_add_remark: '',
  temp_add_templateUrl: ''
}

const filterProps = [
  'createdate',
  'content',
  'leader',
  'level',
  'user',
  'weather',
  'street',
  'richtext',
  'day',
  'month',
  'year',
  'weekday'
]

export default {
  data() {
    return {
      ruleForm: { ...ruleForm },
      dynamicFormProps: {},
      rules: {
        temp_add_templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        temp_add_templateUrl: [{ required: true, message: '请选择模板文件', trigger: 'change' }]
      },
      loading: false,
      limit: 1
    }
  },
  methods: {
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
      const { data, code } = await TemplateApi.uploadTemplate(formData)

      if (code === 0) {
        this.ruleForm.temp_add_templateUrl = data.templateUrl
        this.dynamicFormProps = Object.keys(data.docxProperties).reduce((prev, key) => {
          if (!filterProps.includes(key.toLocaleLowerCase())) {
            prev[key] = data.docxProperties[key]
          }
          return prev
        }, {})
        Object.keys(data.docxProperties).forEach((key) => {
          this.$set(this.ruleForm, key, '')
          this.$set(this.rules, key, [{ required: true, message: `请输入模板中“${key}”自定义名`, trigger: 'blur' }])
        })
        this.$message.success('模板上传成功！')
      } else {
        // 提示信息，需引入Message
        this.$message.error('模板上传失败，请重试！')
      }
    },
    async addTemplate() {
      if (this.loading) return
      this.loading = true
      const params = { ...this.ruleForm }
      const { temp_add_templateName: templateName, temp_add_remark: remark, temp_add_templateUrl: templateUrl } = params
      const docxProperties = {}
      Object.keys(this.dynamicFormProps).forEach((key) => {
        docxProperties[key] = params[key]
        delete params[key]
      })
      const { code } = await TemplateApi.addTemplate({ templateName, remark, templateUrl, docxProperties })
      if (code === 0) {
        this.ruleForm = {
          temp_add_templateName: '',
          temp_add_remark: '',
          temp_add_templateUrl: ''
        }
        this.$message.success('添加模板成功！')
      } else {
        this.$message.error('添加模板失败，请重试！')
      }
      this.loading = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addTemplate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-upload {
  width: 100%;
  .el-upload-dragger {
    width: 100%;
  }
}
</style>
