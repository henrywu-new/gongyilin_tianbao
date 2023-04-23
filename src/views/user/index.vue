<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.username" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="queryParams.mobile" placeholder="电话" />
        </el-form-item>
        <el-form-item label="村庄">
          <el-input v-model="queryParams.village" placeholder="村庄" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 24px">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
        <el-button type="primary" @click="() => $router.push('/user/add')">添加管理员</el-button>
        <el-button type="primary" plain>{{ `总人数：${total}` }}</el-button>
      </div>
      <el-table v-loading="loading" :data="userList" style="width: 100%">
        <el-table-column prop="createDate" label="添加日期" width="140">
          <template slot-scope="scope">
            <span> {{ scope.row.createDate || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="更新日期" width="140">
          <template slot-scope="scope">
            <span> {{ scope.row.updateDate || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="140" />
        <el-table-column prop="mobile" label="电话" width="120" />
        <el-table-column prop="cityName" label="市区" width="180">
          <template slot-scope="scope">
            <span>
              {{
                `${scope.row.provinceName || '---'} / ${scope.row.cityName || '---'} / ${
                  scope.row.countryName || '---'
                }`
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="village" label="村庄" width="180">
          <template slot-scope="scope">
            <span> {{ scope.row.village || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">停用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button style="margin-right: 10px" type="primary" plain @click="handleEdit(scope.row)"> 修改 </el-button>
            <el-popconfirm
              style="margin-right: 10px"
              title="确定删除该用户吗？"
              @confirm="deleteUser(scope.row.id)"
              @onConfirm="deleteUser(scope.row.id)"
            >
              <el-button slot="reference" type="danger" plain :loading="selectId === scope.row.id && loading3">
                删除
              </el-button>
            </el-popconfirm>
            <!-- <el-popconfirm
              title="确定重置密码吗？"
              @confirm="resetPasword(scope.row.id)"
              @onConfirm="resetPasword(scope.row.id)"
            >
              <el-button slot="reference" type="warning" plain :loading="selectId === scope.row.id && loading2">
                重置密码
              </el-button>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end; margin-top: 20px">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="size"
          @current-change="onPageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { CommonApi, UserApi, TemplateApi } from '@/api'
const id = 0
const ruleForm = {
  username: '',
  region: [],
  street: '',
  mobile: '',
  password: '',
  status: ''
}

async function getAreaList(pcode = 100000) {
  const { data, code } = await CommonApi.getAreaList(pcode)
  return code === 0 ? data : undefined
}
export default {
  name: 'User',
  data() {
    return {
      visible: false,
      dialogTitle: '添加管理员',
      ruleForm: { ...ruleForm },
      props: {
        lazy: true,
        lazyLoad: async function(node, resolve) {
          const { level, value } = node
          const pcode = value || 430000
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
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        street: [{ required: true, message: '请输入详情地址', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        region: [{ required: true, message: '请选择地区', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
        // headUrl: [
        //   { required: true, message: '请选择用户头像', trigger: 'change' }
        // ]
      },
      page: 1,
      size: 15,
      total: 0,
      userList: [],
      type: 1,
      loading: false,
      loading2: false,
      loading3: false,
      selectId: '',
      queryParams: {
        username: '',
        mobile: '',
        village: ''
      },
      templateList: [],
      value: ''
    }
  },
  // watch: {
  //   '$store.state.user': {
  //     handler(newVal) {
  //       console.log('newVal======>', newVal)
  //       newVal.id === '0' && this.getUsers()
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },
  mounted() {
    this.getUsers()
    // this.getTemplateList()
  },
  methods: {
    async getUsers() {
      if (this.loading) return
      const { page, size } = this
      const params = { ...this.queryParams, page, size }
      this.loading = true
      const { body, code } = await CommonApi.getAccountList(params)
      this.loading = false
      if (code !== 0) return
      this.userList = body.list
      this.total = body.total
    },
    onSearch() {
      this.page = 1
      this.getUsers()
    },
    onReset() {
      this.queryParams = {
        username: '',
        phone: '',
        streetName: ''
      }
      this.getUsers()
    },
    onPageChange(page) {
      this.page = page
      this.getUsers()
    },
    async getTemplateList() {
      const params = { page: 1, size: 1000 }
      const { data, code } = await TemplateApi.getTemplateList(params)
      if (code === 0) {
        this.templateList = data.list
      }
    },

    onChange(row) {
      this.assignTemplateToUser(row)
      // if (!row.templateId) {
      // } else {
      //   // this.modifyTemplateRelation(row)
      // }
    },

    async assignTemplateToUser(row) {
      const { templateId, id: userId } = row
      if (!templateId) return
      const { code } = await TemplateApi.assignTemplateToUser({ templateId, userId })
      if (code === 0) {
        this.$message.success('关联模板成功！')
      } else {
        // eslint-disable-next-line require-atomic-updates
        row.templateId = ''
        this.$message.error('关联模板失败！')
      }
    },
    async modifyTemplateRelation(row) {
      const { templateId, id: userId } = row
      const { code } = await TemplateApi.modifyTemplateRelation({ templateId, userId })
      if (code === 0) {
        this.$message.success('更新模板成功！')
      } else {
        // eslint-disable-next-line require-atomic-updates
        row.templateId = ''
        this.$message.error('更新模板失败！')
      }
    },

    async delTemplateRelation({ id }) {
      const { code } = await TemplateApi.delTemplateRelation(id)
      if (code === 0) {
        this.$message.success('取消关联模板成功！')
      } else {
        this.$message.error('取消关联模板失败！')
      }
    },

    beforeUpload() {},
    async handleUpload({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      const { data, code } = await CommonApi.upload(formData)
      if (code === 0) {
        this.ruleForm.headUrl = data
      }
    },
    beforeUploadSucc() {},
    showDialog(type, row) {
      this.type = type
      if (type === 1) {
        this.ruleForm = { ...ruleForm }
        this.dialogTitle = '添加管理员'
        this.$set(this.rules, 'password', [{ required: true, message: '请输入密码', trigger: 'blur' }])
        this.$set(this.rules, 'region', [{ required: true, message: '请选择地区', trigger: 'change' }])
        this.rules.password.required = true
      } else {
        this.dialogTitle = '修改管理员信息'
        this.$set(this.rules, 'password', [])
        this.$set(this.rules, 'region', [])
        const { id, username, region, street, mobile, password, status } = row
        this.ruleForm = {
          id,
          username,
          region,
          street,
          mobile,
          password,
          status
        }
      }
      console.log(row)
      this.visible = true
    },
    beforeClose(done) {
      this.$refs.ruleForm.resetFields()
      done()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          if (this.type === 1) {
            this.addUser()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async addUser() {
      const { region } = this.ruleForm
      const [province, city, country] = region
      const params = {
        province,
        city,
        country,
        ...this.ruleForm
      }
      delete params.region

      const { code } = await UserApi.addUser(params)
      if (code === 0) {
        this.visible = false
        this.$message.success('添加用户成功！')
        this.getUsers()
      } else {
        this.$message.error('添加用户失败！')
      }
    },
    async deleteUser(id) {
      if (this.loading3) return

      this.loading3 = true
      this.selectId = id
      const { code } = await CommonApi.delAccountById(id)
      if (code === 0) {
        this.$message.success('删除用户成功！')
        this.getUsers()
      } else {
        this.$message.error('删除用户失败！')
      }
      this.loading3 = false
    },

    resetForm(formName) {
      this.visible = false
    },
    handleEdit(userinfo) {
      this.$router.push({ name: 'userEdit', params: { userinfo }})
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
