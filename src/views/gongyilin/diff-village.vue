<template>
  <div class="app-container">
    <el-card class="box-card" style="margin-top: 24px">
      <el-table v-loading="loading" :data="list" style="width: 100%">
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
        <el-table-column prop="id" label="ID" width="160" />
        <el-table-column prop="name" label="村名" width="200" />
        <el-table-column prop="creator" label="创建者" />
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
import { CommonApi } from '@/api'

export default {
  name: 'User',
  data() {
    return {
      page: 1,
      size: 15,
      total: 0,
      list: [],
      type: 1,
      loading: false,
      loading2: false,
      loading3: false,
      selectId: '',
      value: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.loading) return
      this.loading = true
      const { body, code } = await CommonApi.getVillageGyDiff()
      this.loading = false
      if (code !== 0) return
      this.list = body.list
      this.total = body.total
    },

    onPageChange(page) {
      this.page = page
      this.getList()
    }
  }
}
</script>

            <style lang="scss" scoped>
    </style>

