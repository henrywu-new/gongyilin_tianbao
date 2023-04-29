<template>
  <div v-loading="loading" class="app-container">
    <el-card class="box-card" style="margin-top: 24px">
      <div class="text item">allocate: {{ data.allocate }}</div>
      <div class="text item">diff: {{ data.diff }}</div>
      <div class="text item">street: {{ data.street }}</div>
      <div class="text item">total: {{ data.total }}</div>
      <div class="text item">village: {{ data.village }}</div>
    </el-card>
  </div>
</template>

<script>
import { CommonApi } from '@/api'

export default {
  name: 'User',
  data() {
    return {
      data: {
        allocate: 0,
        diff: 0,
        street: '',
        total: 0,
        village: ''
      },
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.loading) return
      this.loading = true
      const { body, code } = await CommonApi.getGyDiff()
      this.loading = false
      if (code !== 0) return
      this.data = body
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>

