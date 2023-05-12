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
        <el-form-item label="选择用户" prop="id">
          <el-select v-model="value" placeholder="请选择用户" @change="onChange">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="对象代码" prop="code">
          <el-input v-model="ruleForm.code" />
        </el-form-item>
        <el-form-item label="对象姓名" prop="name">
          <el-input v-model="ruleForm.name" maxlength="20" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model.number="ruleForm.phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idcard">
          <el-input v-model="ruleForm.idcard" maxlength="18" />
        </el-form-item>
        <el-form-item label="户口本号" prop="homeNo">
          <el-input v-model="ruleForm.homeNo" />
        </el-form-item>
        <el-form-item label="家庭地址" prop="familyAddress">
          <el-input v-model="ruleForm.familyAddress" />
        </el-form-item>
        <el-form-item label="家庭成员数" prop="familyMember">
          <el-input v-model="ruleForm.familyMember" />
        </el-form-item>
        <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="ruleForm.bankName" />
        </el-form-item>
        <el-form-item label="银行账号" prop="account">
          <el-input v-model="ruleForm.account" disabled />
        </el-form-item>
        <el-form-item label="银行代码" prop="bankCode">
          <el-input v-model="ruleForm.bankCode" />
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
          <el-button :loading="loading" type="primary" @click="validateForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { CommonApi } from '@/api'

const ruleForm = {
  code: '',
  name: '',
  phone: '',
  idcard: '',
  account: '',
  homeNo: '',
  familyAddress: '',
  familyMember: '',
  bankName: '',
  bankCode: '',
  policyUnit: '',
  number: '',
  periods: ''
}

const provinceCode = 430000

async function getAreaList(pcode = 100000) {
  const { body, code } = await CommonApi.getAreaList(pcode)
  return code === 0 ? body : []
}

export default {
  data() {
    return {
      ruleForm: { ...ruleForm },
      // props: {
      //   lazy: true,
      //   lazyLoad: async function(node, resolve) {
      //     const { value } = node
      //     const pcode = value || provinceCode
      //     const list = await getAreaList(pcode)

      //     const nodes = list.map((item) => {
      //       return {
      //         value: item.code,
      //         label: item.name
      //       }
      //     })
      //     resolve(nodes)
      //   }
      // },
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
      loading: false,
      options: []
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const params = { page: 1, size: 1000 }
      const { body, code } = await CommonApi.getUserList(params)
      if (code !== 0) return
      this.$set(this, 'options', body.list)
    },
    onChange() {
      const target = this.options.find((item) => item.id == this.value)
      if (target) {
        Object.keys(this.ruleForm).forEach((key) => {
          if (key === 'account') {
            this.ruleForm['account'] = target['bankAccount'] || ''
          } else {
            this.ruleForm[key] = target[key] || ''
          }
        })
      }
    },
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
      delete params.region

      const { code } = await CommonApi.saveTbInfo(params)
      if (code === 0) {
        this.$message.success('添加成功！')
        this.$router.go(-1)
      } else {
        this.$message.error('添加失败！')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped></style>

