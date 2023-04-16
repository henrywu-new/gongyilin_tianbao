<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="日期">
          <el-date-picker
            v-model="queryParams.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="操作ID">
          <el-input v-model="queryParams.operateId" placeholder="操作ID" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="queryParams.username" placeholder="操作人" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 24px">
      <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column prop="updateDate" label="日期" width="160">
          <template slot-scope="scope">
            <span> {{ scope.row.updateDate || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operateId" label="操作ID">
          <template slot-scope="scope">
            <span> {{ scope.row.operateId || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容">
          <template slot-scope="scope">
            <span> {{ scope.row.content || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="operateUsername" label="操作者" width="160">
          <template slot-scope="scope">
            <span> {{ scope.row.operateUsername || '---' }}</span>
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
  data() {
    return {
      page: 1,
      size: 15,
      total: 0,
      list: [],
      loading: false,
      queryParams: {
        date: [],
        operateId: '',
        username: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.loading) return
      const { page, size } = this
      const { operateId, username, date } = this.queryParams
      const [startTime, endTime] = date || []
      const params = { operateId, username, startTime, endTime, page, size }
      this.loading = true
      const { data, code } = await await CommonApi.getOperateLogs(params)
      this.loading = false
      if (code !== 0) return
      this.list = data.list
      this.total = data.total
    },
    onSearch() {
      this.page = 1
      this.getList()
    },
    onReset() {
      this.queryParams = {
        date: [],
        operateId: '',
        username: ''
      }
      this.getList()
    },
    onPageChange(page) {
      this.page = page
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
