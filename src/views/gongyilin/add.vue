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
        <el-form-item label="银行代码" prop="bankCode">
          <el-input v-model="ruleForm.bankCode" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
  homeNo: '',
  familyAddress: '',
  familyMember: '',
  bankName: '',
  bankCode: ''
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
      loading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addUserBaseInfo()
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
    async addUserBaseInfo() {
      if (this.loading) return
      this.loading = true
      // const { body } = await CommonApi.getAreaByCode(streetCode)
      // const street = body.name
      const params = {
        ...this.ruleForm
      }
      delete params.region

      const { code } = await CommonApi.addUserBaseInfo(params)
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

