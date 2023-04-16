<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      class="fire-info-form"
      :model="ruleForm"
      :rules="rules"
      style="margin-top: 40px"
      label-width="160px"
    >
      <el-form-item label="乡镇（街道）名称" prop="streetName">
        <el-input v-model="ruleForm.streetName" />
      </el-form-item>
      <el-form-item class="dynamic-input-item" label="天气状态" prop="weathers">
        <div class="dynamic-input-wrap">
          <div v-for="(item, index) in ruleForm.weathers" :key="item.key">
            <el-input v-model="item.value" placeholder="请输入天气状况" />
            <div class="action-icon">
              <i
                v-if="index + 1 == ruleForm.weathers.length"
                class="el-icon-circle-plus-outline"
                @click="addItem('weathers')"
              />
              <i
                v-if="index + 1 != ruleForm.weathers.length"
                class="el-icon-remove-outline"
                @click="removeItem('weathers', item.key)"
              />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="dynamic-input-item" label="当日防火等级" prop="levels">
        <div class="dynamic-input-wrap">
          <div v-for="(item, index) in ruleForm.levels" :key="item.key">
            <el-input v-model="item.value" placeholder="请输入当日防火等级" />
            <div class="action-icon">
              <i
                v-if="index + 1 == ruleForm.levels.length"
                class="el-icon-circle-plus-outline"
                @click="addItem('levels')"
              />
              <i
                v-if="index + 1 != ruleForm.levels.length"
                class="el-icon-remove-outline"
                @click="removeItem('levels', item.key)"
              />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="dynamic-input-item" label="带班领导" prop="leaders">
        <div class="dynamic-input-wrap">
          <div v-for="(item, index) in ruleForm.leaders" :key="item.key">
            <el-input v-model="item.value" placeholder="请输入带班领导名字" />
            <div class="action-icon">
              <i
                v-if="index + 1 == ruleForm.leaders.length"
                class="el-icon-circle-plus-outline"
                @click="addItem('leaders')"
              />
              <i
                v-if="index + 1 != ruleForm.leaders.length"
                class="el-icon-remove-outline"
                @click="removeItem('leaders', item.key)"
              />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="dynamic-input-item" label="值班人员" prop="users">
        <div class="dynamic-input-wrap">
          <div v-for="(item, index) in ruleForm.users" :key="item.key">
            <el-input v-model="item.value" placeholder="请输入值班人员名字" />
            <div class="action-icon">
              <i
                v-if="index + 1 == ruleForm.users.length"
                class="el-icon-circle-plus-outline"
                @click="addItem('users')"
              />
              <i
                v-if="index + 1 != ruleForm.users.length"
                class="el-icon-remove-outline"
                @click="removeItem('users', item.key)"
              />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isInit === false"
          type="primary"
          :loading="loading"
          @click="addFireSetting"
        >提交</el-button>
        <el-button
          v-if="isInit === true"
          type="primary"
          :loading="loading"
          @click="updateFireSetting"
        >修改</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { FireApi } from '@/api'

export default {
  name: 'User',
  data() {
    const validateLeaders = (rule, value, callback) => {
      console.log(this.ruleForm.leaders)
      const flag = this.ruleForm.leaders.some((item) => !item.value.trim())
      if (flag) {
        callback(new Error('带班领导姓名不能为空'))
      } else {
        callback()
      }
    }
    const validateUsers = (rule, value, callback) => {
      const flag = this.ruleForm.users.some((item) => !item.value.trim())
      if (flag) {
        callback(new Error('带班领导姓名不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      id: '',
      tableData: [],
      ruleForm: {
        streetName: '',
        levels: [{ key: Date.now(), value: '' }],
        weathers: [{ key: Date.now(), value: '' }],
        leaders: [{ key: Date.now(), value: '' }],
        users: [{ key: Date.now(), value: '' }]
      },
      rules: {
        // streetName: [
        //   { required: true, message: '请输入乡镇名称', trigger: 'blur' }
        // ],
        // levels: [
        //   { required: true, message: '请选择当日防火等级', trigger: 'change' }
        // ],
        // weathers: [
        //   { required: true, message: '请选择天气状况', trigger: 'change' }
        // ],
        // leaders: [
        //   { required: true, validator: validateLeaders, trigger: 'change' }
        // ],
        // users: [
        //   { required: true, validator: validateUsers, trigger: 'change' }
        // ]
      },
      // weatherList: [],
      // dutyLevelList: [],
      isInit: undefined,
      loading: false
    }
  },
  watch: {
    '$store.state.user': {
      handler(newVal) {
        this.ruleForm.streetName = newVal.street
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // this.getWeather()
    // this.getDutyLevel()
    this.getFireSystemInfo()
  },
  mounted() {},
  methods: {
    async getWeather() {
      const { data, code } = await FireApi.getWeather()
      code === 0 && (this.weatherList = data)
    },
    async getDutyLevel() {
      const { data, code } = await FireApi.getDutyLevel()
      code === 0 && (this.dutyLevelList = data)
    },
    async getFireSystemInfo() {
      const { data, code } = await FireApi.getFireSystemInfo()
      if (code === 0 && data && Object.keys(data).length) {
        this.isInit = true
        this.id = data.id
        this.ruleForm.streetName = data.streetName
        this.ruleForm.levels = this.fmtItems(data.levels)
        this.ruleForm.weathers = this.fmtItems(data.weathers)
        this.ruleForm.leaders = this.fmtItems(data.leaders)
        this.ruleForm.users = this.fmtItems(data.users)
      } else {
        this.isInit = false
      }
    },

    fmtItems(items) {
      try {
        return items.map((item) => ({
          key: item,
          value: item
        }))
      } catch {
        return [{ key: Date.now(), value: '' }]
      }
    },

    async addFireSetting() {
      if (this.loading) return
      const flag = await this.validateForm()
      if (!flag) return

      const params = this.getParams()
      this.loading = true
      const { code } = await FireApi.addFireSetting(params)
      if (code === 0) {
        this.$message.success('初始化灭火值班信息成功！')
        location.reload()
      } else {
        this.$message.success('初始化灭火值班信息失败！')
      }
      this.loading = false
    },
    async updateFireSetting() {
      if (this.loading) return
      const flag = await this.validateForm()
      if (!flag) return

      const params = this.getParams()

      this.loading = true
      const { code } = await FireApi.updateFireSetting({ id: this.id, ...params })
      if (code === 0) {
        this.$message.success('修改化灭火值班信息成功！')
        location.reload()
      } else {
        this.$message.success('修改化灭火值班信息失败！')
      }
      this.loading = false
    },

    getParams() {
      const { streetName } = this.ruleForm
      let { leaders, users, levels, weathers } = this.ruleForm
      leaders = leaders.map((item) => item.value)
      users = users.map((item) => item.value)
      levels = levels.map((item) => item.value)
      weathers = weathers.map((item) => item.value)

      return { streetName, levels, weathers, leaders, users }
    },

    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // alert('submit!')
            resolve(true)
          } else {
            console.log('error submit!!')
            resolve(false)
            return false
          }
        })
      })
    },
    resetForm(formName) {
      this.$router.go(-1)
      // this.$refs[formName].resetFields()
    },
    addItem(type) {
      this.ruleForm[type].push({
        value: '',
        key: Date.now()
      })
    },
    removeItem(type, key) {
      const index = this.ruleForm[type].findIndex((item) => item.key === key)
      console.log(index)
      if (index > -1) {
        this.ruleForm[type].splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .fire-info-form {
  .el-form-item__content {
    max-width: 300px;
  }
  .no-limit-whdth .el-form-item__content {
    max-width: none;
  }
  .el-cascader {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
.dynamic-input-item {
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
}
</style>
