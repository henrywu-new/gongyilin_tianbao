<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="权属">
          <el-select v-model="queryParams.ownership" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="queryParams.operateType" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
          <el-button type="primary" @click="() => $router.push('/baseconfigg/add')">添加基础配置</el-button>
        </div>
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
        <el-table-column prop="area" label="补助面积（单位亩）" width="140" />
        <el-table-column prop="areaUnit" label="补助标准单位（元/亩）" width="160" />
        <el-table-column prop="operateType" label="操作类型" width="120">
          <template slot-scope="scope">
            <span> {{ fmtValue(options2, scope.row.operateType) || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ownership" label="权属" width="120">
          <template slot-scope="scope">
            <span> {{ fmtValue(options, scope.row.ownership) || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="street" label="乡镇" width="180" />
        <el-table-column prop="village" label="村落" />
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
      userList: [],
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
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.loading) return
      const { page, size } = this
      const { ownership, operateType, date } = this.queryParams
      let [startTime, endTime] = date

      startTime = startTime ? startTime + ' 00:00:00' : ''
      endTime = endTime ? endTime + ' 23:59:59' : ''

      const params = { ownership, operateType, startTime, endTime, page, size }
      this.loading = true
      const { body, code } = await CommonApi.getBaseInfoList(params)
      this.loading = false
      if (code !== 0) return
      this.userList = body.list
      this.total = body.total
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

    fmtValue(options, value) {
      const target = options.find((item) => {
        return item.value == value
      })
      return target?.label || ''
    },

    onPageChange(page) {
      this.page = page
      this.getList()
    },
    beforeUpload() {},
    async handleUpload({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      await CommonApi.uploadUsers(formData)
      this.$message.success('导入用户信息成功！')
      this.getList()
    },

    async handleDelete({ id }) {
      if (this.loading3) return

      this.loading3 = true
      this.selectId = id
      const { code } = await CommonApi.delBaseInfoById(id)
      if (code === 0) {
        this.$message.success('删除成功！')
        this.getList()
      } else {
        this.$message.error('删除失败！')
      }
      this.loading3 = false
    },
    handleEdit(baseinfo) {
      this.$router.push({ name: 'baseconfigEdit', query: { ...baseinfo }})
    }
  }
}
</script>

    <style lang="scss" scoped>
</style>

