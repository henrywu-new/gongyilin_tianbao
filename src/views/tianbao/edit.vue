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
        <el-form-item label="对象代码" prop="code">
          <el-input v-model="ruleForm.code" disabled />
        </el-form-item>
        <el-form-item label="对象姓名" prop="name">
          <el-input v-model="ruleForm.name" maxlength="20" disabled />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.number="ruleForm.phone" maxlength="11" disabled />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idcard">
          <el-input v-model="ruleForm.idcard" maxlength="18" disabled />
        </el-form-item>
        <el-form-item label="户口本号" prop="homeNo">
          <el-input v-model="ruleForm.homeNo" disabled />
        </el-form-item>
        <el-form-item label="家庭地址" prop="familyAddress">
          <el-input v-model="ruleForm.familyAddress" disabled />
        </el-form-item>
        <el-form-item label="家庭成员数" prop="familyMember">
          <el-input v-model="ruleForm.familyMember" disabled />
        </el-form-item>
        <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="ruleForm.bankName" disabled />
        </el-form-item>
        <el-form-item label="银行账号" prop="account">
          <el-input v-model="ruleForm.account" disabled />
        </el-form-item>
        <el-form-item label="银行代码" prop="bankCode">
          <el-input v-model="ruleForm.bankCode" disabled />
        </el-form-item>
        <el-form-item label="期数" prop="periods">
          <el-input v-model="ruleForm.periods" />
        </el-form-item>
        <el-form-item label="政策单位" prop="policyUnit">
          <el-input v-model="ruleForm.policyUnit" />
        </el-form-item>
        <el-form-item label="补助面积" prop="number">
          <el-input v-model="ruleForm.number" placeholder="单位：亩" />
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
  id: '',
  code: '',
  name: '',
  phone: '',
  idcard: '',
  homeNo: '',
  familyAddress: '',
  familyMember: '',
  bankName: '',
  bankCode: '',
  policyUnit: '',
  number: '',
  account: '',
  periods: ''
}

export default {
  data() {
    return {
      ruleForm: { ...ruleForm },
      rules: {
        id: [{ required: true, message: '请选择用户', trigger: 'blur' }]
        // street: [
        //   { required: true, message: '请输入详情地址', trigger: 'blur' }
        // ],
        // mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        // region: [{ required: true, message: '请选择地区', trigger: 'change' }],
        // status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      loading: false,
      value: ''
    }
  },
  created() {
    const { query } = this.$route
    Object.keys(ruleForm).forEach(key => {
      this.ruleForm[key] = query[key]
    })
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
      // const { body } = await CommonApi.getAreaByCode(streetCode)
      // const street = body.name
      const params = {
        ...this.ruleForm
      }

      const { code } = await CommonApi.updateTbInfo(params)
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
  <style lang="scss" scoped></style>

