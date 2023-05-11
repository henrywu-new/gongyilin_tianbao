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
        <el-form-item label="村庄" prop="village">
          <el-select v-model="ruleForm.village" placeholder="请选择">
            <el-option v-for="item in villageList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
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
import { CommonApi, UserApi } from '@/api'

const ruleForm = {
  username: '',
  region: [],
  street: '',
  mobile: '',
  password: '',
  village: ''
}

async function getAreaList(pcode = 100000) {
  const { body, code } = await CommonApi.getAreaList(pcode)
  return code === 0 ? body : []
}
const provinceCode = 430000

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
      qrcode: require('@/assets/wechat_qrcode.jpg'),
      loading: false
    }
  },
  created() {
    console.log(this.$route)
    const { query } = this.$route
    const { id, username, city, country, street, village, mobile } = query || ruleForm
    this.ruleForm = {
      id,
      username,
      region: [city, country, street],
      street,
      mobile,
      password: '',
      village
    }
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
          this.updateUserInfo()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$router.go(-1)
    },

    async updateUserInfo() {
      if (this.loading) return
      this.loading = true
      const { region } = this.ruleForm
      let params = { ...this.ruleForm }

      if (region && region.length) {
        const [city, country, street] = region
        params = {
          ...this.ruleForm,
          province: provinceCode,
          city,
          country,
          street
        }
        delete params.region
      }
      if (!params.password) delete params.password
      const { code } = await CommonApi.updateAccount(params)
      if (code === 0) {
        this.visible = false
        this.$message.success('用户信息更新成功！')
        // const html = `<strong>乡镇森林防灭火值班管理系统</strong><br/><span>软件开发：湖南省平江县大洲乡农业综合服务中心 钟咨 邱河海 何旭东
        //     <br/>2023年软件使用联系：13874099950（微信）</span><br/>
        //   <img src="${this.qrcode}" style="display: block; width: 120px; height: 120px; margin: 10px auto" />
        //   `
        // this.$alert(html, '用户信息更新成功！', {
        //   dangerouslyUseHTMLString: true,
        //   callback: () => {
        //     this.$router.go(-1)
        //   }
        // })
      } else {
        this.$message.error('用户信息更新失败！')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped></style>
