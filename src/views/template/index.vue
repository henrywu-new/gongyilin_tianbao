<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="模板名称">
          <el-input v-model="queryParams.templateName" placeholder="模板名称" />
        </el-form-item>
        <el-form-item label="模板备注">
          <el-input v-model="queryParams.remark" placeholder="模板备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 24px">
      <el-button type="primary" style="margin-bottom: 20px" @click="$router.push('/template/add')">添加模板</el-button>
      <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column prop="createDate" label="添加日期" width="140">
          <template slot-scope="scope">
            <span> {{ scope.row.createDate || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="150">
          <template slot-scope="scope">
            <span> {{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="templateName" label="名称" width="140">
          <template slot-scope="scope">
            <span> {{ scope.row.templateName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="templateUrl" label="链接" width="340">
          <template slot-scope="scope">
            <a style="color: blue" @click="handlePreview(scope.row.templateUrl)"> {{ scope.row.templateUrl }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <span> {{ scope.row.remark || '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-button style="margin-right: 10px" type="primary" plain @click="handleModify(scope.row)">
              选择用户
            </el-button> -->
            <el-button style="margin-right: 10px" type="primary" plain @click="handleModify(scope.row)">
              修改
            </el-button>
            <el-popconfirm
              style="margin-right: 10px"
              title="确定删除该模板吗？"
              @confirm="deleteTemp(scope.row.id)"
              @onConfirm="deleteTemp(scope.row.id)"
            >
              <el-button slot="reference" type="danger" plain :loading="selectId === scope.row.id && loading2">
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
    <el-dialog :visible="visible" title="模板预览" width="90%" @close="() => (visible = false)">
      <iframe
        style="width: 100%; height: 84vh; border-radius: 4px"
        :src="template_office_url"
        frameborder="0"
      />
    </el-dialog>
  </div>
</template>

<script>
import { CommonApi, TemplateApi } from '@/api'
export default {
  name: 'Template',
  data() {
    return {
      list: [],
      queryParams: {
        templateName: '',
        remark: ''
      },
      total: 0,
      size: 15,
      page: 1,
      loading: false,
      loading2: false,
      limit: 5,
      selectId: '',
      visible: false,
      template_office_url: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const params = { ...this.queryParams, page: this.page, size: this.size }
      const { data, code } = await TemplateApi.getTemplateList(params)
      console.log(data)
      if (code === 0) {
        this.list = data.list
      }
      this.loading = false
    },
    onSearch() {
      this.page = 1
      this.getList()
    },
    async deleteTemp(id) {
      this.loading2 = true
      const { code } = await TemplateApi.delTemplate(id)
      if (code === 0) {
        this.getList()
        this.$message.success('删除模板上传成功！')
      } else {
        // 提示信息，需引入Message
        this.$message.error('删除模板失败！')
      }
      this.loading2 = false
    },
    handleModify(data) {
      this.$router.push({ name: 'templateEdit', params: { data }})
    },
    onReset() {
      this.queryParams = {
        templateName: '',
        remark: ''
      }
      this.getList()
    },
    onPageChange(page) {
      this.page = page
      this.getList()
    },
    handlePreview(src) {
      this.template_office_url = `https://view.officeapps.live.com/op/view.aspx?src=${src}`
      this.visible = true
      //   const previewlink = `https://view.officeapps.live.com/op/view.aspx?src=${src}`
      //   window.open(previewlink, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped></style>
