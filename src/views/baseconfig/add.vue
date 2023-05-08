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
        <el-form-item label="补助面积" prop="area">
          <el-input v-model.number="ruleForm.area" placeholder="补助面积" />
        </el-form-item>
        <el-form-item label="补助标准单位" prop="areaUnit">
          <el-input v-model.number="ruleForm.areaUnit" placeholder="补助标准单位" />
        </el-form-item>
        <el-form-item label="村落" prop="village">
          <el-select v-model="ruleForm.village" placeholder="请选择">
            <el-option v-for="item in villageList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="权属">
          <el-select v-model="ruleForm.ownership" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="ruleForm.operateType" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
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
import { CommonApi } from '@/api'

const ruleForm = {
  area: '',
  areaUnit: '',
  operateType: '',
  ownership: '',
  village: ''
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
      loading: false,
      options: [
        // 0-个人，1-集体，2-非国有，3-国有
        {
          label: '个人',
          value: 0
        },
        {
          label: '集体',
          value: 1
        },
        {
          label: '非国有',
          value: 2
        },
        {
          label: '国有',
          value: 3
        }
      ],
      options2: [
        // 0-公益林，1-天保
        {
          label: '公益林',
          value: 0
        },
        {
          label: '天保',
          value: 1
        }
      ],
      villageList: []
    }
  },
  created() {
    this.getVillageList()
  },
  methods: {
    async getVillageList() {
      if (this.loading) return

      const params = { page: 1, size: 500 }
      this.loading = true
      const { body, code } = await CommonApi.getCountryInfo(params)
      this.loading = false
      if (code !== 0) return
      this.villageList = body.list
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveBaseInfo()
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
    async saveBaseInfo() {
      if (this.loading) return
      this.loading = true
      // const { body } = await CommonApi.getAreaByCode(streetCode)
      // const street = body.name
      const params = {
        ...this.ruleForm
      }

      const { code } = await CommonApi.saveBaseInfo(params)
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
