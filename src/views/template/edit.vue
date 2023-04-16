<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="160px"
        style="margin-top: 20px"
        class="dialog-form"
      >
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="ruleForm.templateName" maxlength="200" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板备注" prop="remark">
          <el-input v-model="ruleForm.remark" maxlength="20" placeholder="请输入模板备注" />
        </el-form-item>
        <el-form-item label="上传模板" prop="templateUrl">
          <el-upload accept=".doc,.docx" drag action="" :before-upload="beforeUpload" :http-request="handleUpload">
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">{{ `只能上传.doc/.docx文件，且不超过${limit}M` }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">修改</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { TemplateApi } from '@/api'

const ruleForm = {
  id: '',
  templateName: '',
  remark: '',
  templateUrl: ''
}

export default {
  data() {
    return {
      ruleForm: { ...ruleForm },
      rules: {
        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        templateUrl: [{ required: true, message: '请选择模板文件', trigger: 'change' }]
      },
      loading: false,
      limit: 1
    }
  },
  created() {
    const {
      params: { data }
    } = this.$route
    const { id, templateName, remark, templateUrl } = data
    this.ruleForm = {
      id,
      templateName,
      remark,
      templateUrl
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
        this.ruleForm.templateUrl = data.templateUrl
        this.$message.success('模板上传成功！')
      } else {
        // 提示信息，需引入Message
        this.$message.error('模板上传失败，请重试！')
      }
    },
    async modifyTemplate() {
      if (this.loading) return
      this.loading = true
      const { code } = await TemplateApi.modifyTemplate(this.ruleForm)
      if (code === 0) {
        this.$message.success('修改模板成功！')
        this.$router.go(-1)
      } else {
        this.$message.error('修改模板失败，请重试！')
      }
      this.loading = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifyTemplate()
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
::v-deep .el-upload-dragger {
  max-width: 300px;
}
</style>
