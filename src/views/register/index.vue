<template>
  <div class="register-container">
    <el-form ref="loginForm" :model="ruleForm" :rules="rules" size="large" class="register-form" auto-complete="on">
      <div class="title-container">
        <h3 class="title">管理员账号注册</h3>
      </div>

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item prop="region">
          <el-cascader v-model="ruleForm.region" :props="props" filterable placeholder="请选择区域" />
        </el-form-item>
        <!-- <el-form-item prop="street">
          <el-input v-model="ruleForm.street" type="textarea" maxlength="200" placeholder="请输入乡镇（街道）名称" />
        </el-form-item> -->
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" maxlength="20" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" :type="passwordType" placeholder="请输入密码" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model.number="ruleForm.mobile" maxlength="11" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item prop="smsCode">
          <div style="display: flex; align-items: center">
            <!-- <div class="yzm_picture_div">
              {{ smsCode }}
            </div> -->
            <el-input v-model.number="ruleForm.smsCode" maxlength="6" placeholder="请输入验证码" />
            <el-button type="primary" class="yzm_text_div" :disabled="time > 0">
              <a href="javascript:void(0);" @click="loadCode">{{ time > 0 ? time + 's' : '获取验证码' }}</a>
            </el-button>
          </div>
        </el-form-item>
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleSubmit"
        >注 册</el-button>
        <div style="display: flex; justify-content: flex-end">
          <el-link type="success" @click="() => $router.push({ path: '/login' })">有账号？去登陆</el-link>
        </div>
      </el-form>
    </el-form>
  </div>
</template>

<script>
import { CommonApi, UserApi } from '@/api'

const ruleForm = {
  username: '',
  region: [],
  street: '',
  streetCode: '',
  mobile: '',
  password: '',
  smsCode: ''
}

const provinceCode = 430000

async function getAreaList(pcode = 100000) {
  const { data, code } = await CommonApi.getAreaList(pcode)
  return code === 0 ? data : undefined
}

const reg = /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/
function isMobile(rule, value, callback) {
  if (reg.test(value)) {
    callback()
  } else {
    callback('请输入11位正确手机号')
  }
}

export default {
  name: 'Login',
  data() {
    return {
      ruleForm: { ...ruleForm },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        street: [{ required: true, message: '请输入详情地址', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          {
            validator: isMobile,
            trigger: 'blur'
          }
        ],
        region: [{ required: true, message: '请选择地区', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      props: {
        lazy: true,
        lazyLoad: async function(node, resolve) {
          const { level, value } = node
          const pcode = value || provinceCode
          const list = await getAreaList(pcode)

          const nodes = list.map((item) => {
            return {
              value: item.code,
              label: item.name
              // leaf: level >= 2
            }
          })
          resolve(nodes)
        }
      },
      qrcode: require('@/assets/wechat_qrcode.jpg'),
      time: 0,
      timer: null
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.handleRegister()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    loadCode() {
      if (this.time > 0) return
      this.$refs.ruleForm.validateField(['mobile'], async(error) => {
        if (error) return
        const { data, code } = await UserApi.getSmsCode(this.ruleForm.mobile)
        if (code === 0) {
          this.time = 60
          this.$message.success('获取验证码成功，请查收短信！')
          this.timer = setInterval(() => {
            this.time -= 1
            if (this.time <= 0) {
              clearInterval(this.timer)
            }
          }, 1000)
        } else {
          this.$message.error('获取验证码失败，请重试！')
        }
      })
    },
    async handleRegister() {
      if (this.loading) return
      this.loading = true
      const { region } = this.ruleForm
      const [city, country, streetCode] = region
      const { data } = await CommonApi.getAreaDetail(streetCode)
      const street = data.name
      const params = {
        ...this.ruleForm,
        province: provinceCode,
        city,
        country,
        street,
        streetCode
      }
      delete params.region
      const { code } = await UserApi.register(params).catch(() => {
        this.loading = false
      })
      if (code === 0) {
        const html = `<strong>乡镇森林防灭火值班管理系统</strong><br/><span>软件开发：湖南省平江县大洲乡农业综合服务中心 钟咨 邱河海 何旭东
            <br/>2023年软件使用联系：13874099950（微信）</span><br/>
          <img src="${this.qrcode}" style="display: block; width: 120px; height: 120px; margin: 10px auto" />
          `
        this.$alert(html, '注册成功！', {
          dangerouslyUseHTMLString: true
        })
        this.$refs.ruleForm.resetFields()
      } else {
        this.$message.error('注册失败，请稍后重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    // color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    input {
      width: 100%;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      // border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      // caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-button {
    height: 47px;
  }
  .el-cascader {
    width: 100%;
  }
  .el-textarea {
    display: block;
    textarea {
      background: transparent;
      border: 0px;
    }
  }

  .el-form-item {
    border: 1px solid #f5f5f5;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #606266;
$light_gray: #eee;

.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    top: -100px;
    width: 520px;
    max-width: 90%;
    padding: 40px 40px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      // color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .yzm_picture_div {
    height: 47px;
    width: 120px;
    line-height: 2;
    letter-spacing: 0.1em;
    color: #fff;
    font-size: 20px;
    font-weight: 900;
    padding: 0 10px;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .yzm_text_div {
    height: 47px;
    font-size: 14px;
    width: 120px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    a {
      color: #fff;
      white-space: nowrap;
    }
  }
}
</style>
