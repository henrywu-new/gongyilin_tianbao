<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="160px"
        style="margin-top: 40px"
        class="dialog-form"
      >
        <el-form-item label="村名" prop="area">
          <el-input v-model="ruleForm.name" placeholder="村名" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="validateForm('ruleForm')">添加</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { CommonApi } from '@/api'

const ruleForm = {
  names: [{ id: Date.now(), value: '' }]
}

export default {
  data() {
    return {
      ruleForm: { ...ruleForm },
      rules: {
        // username: [
        //   { required: true, message: '请输入用户名', trigger: 'blur' }
        // ],
        // street: [
        //   { required: true, message: '请输入详情地址', trigger: 'blur' }
        // ],
        // mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        // region: [{ required: true, message: '请选择地区', trigger: 'change' }],
        // status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      loading: false
    }
  },
  created() {
    const { query } = this.$route
    const { id, name } = query || ruleForm
    this.ruleForm = { id, name }
  },
  methods: {
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    },
    async submitForm() {
      if (this.loading) return
      this.loading = true

      const params = { names: [this.ruleForm.name] }

      const { code } = await CommonApi.updateCountryInfo(params)
      if (code === 0) {
        this.$message.success('修改成功！')
        this.$router.go(-1)
      } else {
        this.$message.error('修改失败！')
      }
      this.loading = false
    }
  }
}
</script>
  <style lang="scss" scoped>
.dynamic-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > div {
    position: relative;
  }
}
.action-icon {
  position: absolute;
  top: 0;
  right: -22px;
  cursor: pointer;
  .el-icon-circle-plus-outline {
    font-size: 18px;
  }
  .el-icon-remove-outline {
    font-size: 18px;
    color: red;
  }
}
</style>

