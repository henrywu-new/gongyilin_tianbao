<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="queryParams.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="值班人员">
          <el-input v-model="queryParams.user" placeholder="值班人员" />
        </el-form-item>
        <el-form-item label="带班领导">
          <el-input v-model="queryParams.leader" placeholder="带班领导" />
        </el-form-item>
        <el-form-item label="防火等级">
          <el-input v-model="queryParams.level" placeholder="防火等级" />
        </el-form-item>
        <el-form-item label="天气">
          <el-input v-model="queryParams.weather" placeholder="天气" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 24px">
      <el-button
        type="primary"
        style="margin-bottom: 20px"
        @click="() => $router.push('/fire/log/add')"
      >添加防火日志</el-button>
      <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column prop="createDate" label="创建日期" width="140" />
        <el-table-column prop="updateDate" label="更新日期" width="140" />
        <el-table-column prop="weather" label="天气状况" width="120" />
        <el-table-column prop="level" label="防火等级" width="120" />
        <el-table-column prop="leader" label="带班领导" width="120" />
        <el-table-column prop="user" label="值班人员" />
        <el-table-column fixed="right" label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="warning" plain @click="handleEdit(scope.row)"> 修改 </el-button>
            <el-popconfirm
              style="margin-left: 10px"
              title="确定删除日志吗？"
              @confirm="deleteLog(scope.row.id)"
              @onConfirm="deleteLog(scope.row.id)"
            >
              <el-button slot="reference" type="danger" plain :loading="selectId === scope.row.id && loading2">
                删除
              </el-button>
            </el-popconfirm>
            <el-button
              style="margin-left: 10px"
              type="primary"
              plain
              :loading="selectId === scope.row.id && loading3"
              @click="downloadFile(scope.row)"
            >
              下载日志
            </el-button>
            <!-- <el-button plain @click="showDialog(2, scope.row)"> 打印 </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end; margin-top: 20px">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="size"
          :total="total"
          @current-change="onPageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { FireApi } from '@/api'

export default {
  data() {
    return {
      loading: false,
      loading2: false,
      loading3: false,
      page: 1,
      size: 15,
      total: 0,
      list: [],
      queryParams: {
        date: [],
        leader: '',
        level: '',
        user: '',
        weather: ''
      },
      selectId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { page, size } = this
      const { date, leader, level, user, weather } = this.queryParams
      let [startTime, endTime] = date

      startTime = startTime ? startTime + ' 00:00:00' : ''
      endTime = endTime ? endTime + ' 23:59:59' : ''

      const params = {
        leader,
        level,
        user,
        weather,
        startTime,
        endTime,
        page,
        size
      }
      this.loading = true
      const { data, code } = await FireApi.getLogList(params)
      this.loading = false
      if (code === 0) {
        this.list = data.list
        this.total = data.total
      }
    },
    handleEdit({ id }) {
      this.$router.push({
        path: '/fire/log/edit',
        query: { id }
      })
    },
    async deleteLog(id) {
      this.selectId = id
      this.loading2 = true
      const { code } = await FireApi.deleteLog(id)
      if (code === 0) {
        this.$message.success('删除日志成功！')
        this.getList()
      } else {
        this.$message.error('删除日志失败！')
      }
      this.loading2 = false
    },
    onSearch() {
      this.page = 1
      this.getList()
    },
    onReset() {
      this.queryParams = {
        leader: '',
        level: '',
        user: '',
        weather: ''
      }
      this.getList()
    },
    onPageChange(page) {
      this.page = page
      this.getList()
    },
    async downloadFile({ id }) {
      this.selectId = id
      this.loading3 = true
      await FireApi.getPrintFile(id).catch(() => {
        this.loading3 = false
      })
      this.loading3 = false
    },
    async showDetail(row) {
      await FireApi.getPrintFile(row.id)
      // localStorage.setItem('firelog', JSON.stringify(row || {}))
      // this.$router.push({ path: '/print' })
    }
  }
}
</script>

<style lang="scss" scoped>
.uploader {
  display: none;
}
</style>
