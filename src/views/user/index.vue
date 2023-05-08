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
        <el-button type="primary" @click="() => $router.push('/user/add')">添加用户</el-button>
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
          layout="total, prev, pager, next"
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

export default {
  name: 'User',
  data() {
    return {
      visible: false,
      dialogTitle: '添加管理员',
      ruleForm: { ...ruleForm },
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
  mounted() {
    this.getUsers()
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
    handleEdit(userinfo) {
      this.$router.push({ name: 'userEdit', query: { ...userinfo }})
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
