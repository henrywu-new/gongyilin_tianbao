<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryParams.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="queryParams.idcard" placeholder="身份证" />
        </el-form-item>
        <el-form-item label="添加日期">
          <el-date-picker
            v-model="queryParams.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 24px">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
        <div style="display: flex; gap: 10px">
          <el-button type="primary" @click="() => $router.push('/user/baseinfo/add')">添加用户基础数据</el-button>
          <el-upload action="" :before-upload="beforeUpload" :show-file-list="false" :http-request="handleUpload">
            <el-button type="primary">导入用户基础数据</el-button>
          </el-upload>
        </div>
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
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="homeNo" label="户口本号" width="120" />
        <el-table-column prop="idcard" label="身份证号码" width="120" />
        <el-table-column prop="familyAddress" label="家庭地址" width="180" />
        <el-table-column prop="bankName" label="银行名称" width="180" />
        <el-table-column prop="bankCode" label="银行代码" width="120" />
        <el-table-column prop="street" label="所属乡镇" width="180" />
        <el-table-column prop="familyMember" label="家庭成员数" />
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button style="margin-right: 10px" type="primary" plain @click="handleEdit(scope.row)"> 修改 </el-button>
            <el-popconfirm
              style="margin-right: 10px"
              title="确定删除吗？"
              @confirm="deleteUser(scope.row)"
              @onConfirm="deleteUser(scope.row)"
            >
              <el-button slot="reference" type="danger" plain :loading="selectId === scope.row.id && loading3">
                删除
              </el-button>
            </el-popconfirm>
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
import { CommonApi } from '@/api'

export default {
  name: 'User',
  data() {
    return {
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
        name: '',
        phone: '',
        village: '',
        idcard: '',
        date: []
      },
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
      const { name, phone, village, idcard, date } = this.queryParams
      let [startTime, endTime] = date

      startTime = startTime ? startTime + ' 00:00:00' : ''
      endTime = endTime ? endTime + ' 23:59:59' : ''

      const params = { name, phone, village, idcard, startTime, endTime, page, size }
      this.loading = true
      const { body, code } = await CommonApi.getUserList(params)
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
    beforeUpload() {},
    async handleUpload({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      await CommonApi.uploadUsers(formData)
      this.$message.success('导入用户信息成功！')
      this.getUsers()
    },

    async deleteUser({ id }) {
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
    handleEdit(baseinfo) {
      this.$router.push({ name: 'baseinfEdit', query: { ...baseinfo }})
    }
  }
}
</script>

  <style lang="scss" scoped>
</style>

