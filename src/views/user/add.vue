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
        <el-form-item label="地区" prop="region">
          <el-cascader v-model="ruleForm.region" :props="props" filterable placeholder="请选择地区" />
        </el-form-item>
        <!-- <el-form-item label="乡镇（街道）名称" prop="street">
          <el-input v-model="ruleForm.street" type="textarea" maxlength="200" />
        </el-form-item> -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" maxlength="20" />
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model.number="ruleForm.mobile" maxlength="11" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item v-if="role !== 'superadmin'" label="村庄" prop="village">
          <el-select v-model="ruleForm.village" placeholder="请选择">
            <el-option v-for="item in villageList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { CommonApi, UserApi } from '@/api'

const ruleForm = {
  username: '',
  region: [],
  street: '',
  mobile: '',
  password: '',
  village: ''
  // status: 1
}

const provinceCode = 430000

async function getAreaList(pcode = 100000) {
  const { body, code } = await CommonApi.getAreaList(pcode)
  console.log(100000, body)
  return code === 0 ? body : []
}

export default {
  data() {
    return {
      ruleForm: { ...ruleForm },
      props: {
        lazy: true,
        lazyLoad: async function(node, resolve) {
          const { value } = node
          const pcode = value || provinceCode
          const list = await getAreaList(pcode)

          const nodes = list.map((item) => {
            return {
              value: item.code,
              label: item.name
            }
          })
          resolve(nodes)
        }
      },
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
      villageList: []
    }
  },
  computed: {
    role() {
      const { userinfo } = this.$store.getters
      return userinfo.id === '0' ? 'superadmin' : !userinfo.village ? 'admin' : 'normal'
    }
  },
  created() {
    this.getVillageList()
  },
  methods: {
    async getVillageList() {
      const params = { page: 1, size: 500 }
      const { body, code } = await CommonApi.getCountryInfo(params)
      if (code !== 0) return
      this.villageList = body.list
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addUser()
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
    async addUser() {
      if (this.loading) return
      this.loading = true
      const { region } = this.ruleForm
      const [city, country, street] = region
      // const { body } = await CommonApi.getAreaByCode(streetCode)
      // const street = body.name
      const params = {
        ...this.ruleForm,
        province: provinceCode,
        city,
        country,
        street
        // streetCode
      }
      delete params.region

      const { code } = await CommonApi.addAccount(params)
      if (code === 0) {
        this.$message.success('添加账号成功！')
        this.$router.go(-1)
      } else {
        this.$message.error('添加账号失败！')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped></style>
