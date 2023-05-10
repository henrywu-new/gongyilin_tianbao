<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
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
      <el-tabs v-model="activeName">
        <el-tab-pane label="相差" name="first">
          <div class="text item">乡镇: {{ diffData.street }}</div>
          <div class="text item">村落: {{ diffData.village }}</div>
          <div class="text item">总面积: {{ diffData.total }}</div>
          <div class="text item">已分配面积: {{ diffData.allocate }}</div>
          <div class="text item">相差: {{ diffData.diff }}</div>
        </el-tab-pane>
        <el-tab-pane label="乡村相差" name="second">
          <div class="text item">乡镇: {{ villageDiffData.street }}</div>
          <div class="text item">村落: {{ villageDiffData.village }}</div>
          <div class="text item">总面积: {{ villageDiffData.total }}</div>
          <div class="text item">已分配面积: {{ villageDiffData.allocate }}</div>
          <div class="text item">相差: {{ villageDiffData.diff }}</div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="box-card" style="margin-top: 24px">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
        <div style="display: flex; gap: 10px">
          <el-button type="primary" @click="() => $router.push('/gongyilin/add')">添加</el-button>
        </div>
      </div>
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
        <el-table-column prop="name" label="用户名" width="100" />
        <el-table-column prop="idcard" label="身份证号" width="160" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="account" label="银行账号" width="200" />
        <el-table-column prop="familyAddress" label="村名" width="200" />
        <el-table-column prop="policyUnit" label="补助面积" width="100" />
        <el-table-column prop="number" label="补助数量" />
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button style="margin-right: 10px" type="primary" plain @click="handleEdit(scope.row)"> 修改 </el-button>
            <el-popconfirm
              style="margin-right: 10px"
              title="确定删除吗？"
              @confirm="handleDelete(scope.row)"
              @onConfirm="handleDelete(scope.row)"
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
      queryParams: {
        ownership: '',
        operateType: '',
        date: []
      },
      value: '',
      activeName: 'first',
      diffData: {
        allocate: 0,
        diff: 0,
        street: '',
        total: 0,
        village: ''
      },
      villageDiffData: {
        allocate: 0,
        diff: 0,
        street: '',
        total: 0,
        village: ''
      }
    }
  },
  mounted() {
    this.getList()
    this.getGyDiff()
    this.getVillageGyDiff()
  },
  methods: {
    async getList() {
      if (this.loading) return
      const { page, size } = this
      const { date } = this.queryParams
      let [startTime, endTime] = date

      startTime = startTime ? startTime + ' 00:00:00' : ''
      endTime = endTime ? endTime + ' 23:59:59' : ''

      const params = { startTime, endTime, page, size }
      this.loading = true
      const { body, code } = await CommonApi.getTbList(params)
      this.loading = false
      if (code !== 0) return
      this.list = body.list
      this.total = body.total
    },
    async getVillageGyDiff() {
      const { body, code } = await CommonApi.getTbDiff()
      if (code !== 0) return
      this.villageDiffData = body
    },
    async getGyDiff() {
      const { body, code } = await CommonApi.getVillageTbDiff()
      if (code !== 0) return
      this.diffData = body
    },
    onSearch() {
      this.page = 1
      this.getList()
    },
    onReset() {
      this.queryParams = {
        username: '',
        phone: '',
        streetName: ''
      }
      this.getList()
    },

    onPageChange(page) {
      this.page = page
      this.getList()
    },

    async handleDelete({ id }) {
      if (this.loading3) return

      this.loading3 = true
      this.selectId = id
      const { code } = await CommonApi.delTbData(id)
      if (code === 0) {
        this.$message.success('删除成功！')
        this.getList()
      } else {
        this.$message.error('删除失败！')
      }
      this.loading3 = false
    },
    handleEdit(data) {
      this.$router.push({ name: 'tianbaoEdit', query: { ...data }})
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

