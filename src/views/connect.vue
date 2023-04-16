<template>
  <div class="app-container">
    <el-card class="card-wrapper">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>乡镇森林防灭火值班管理系统</span>
        </div>
        软件开发：湖南省平江县大洲乡农业综合服务中心 钟咨 邱河海 何旭东
        <br>2023年软件使用联系：13874099950（微信）<br>
        <img :src="qrcode" style="display: block; width: 120px; height: 120px; margin: 10px auto">
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Connect',
  data() {
    return {
      qrcode: require('@/assets/wechat_qrcode.jpg')
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 90px);
  background-image: url('../assets/bgc.jpg');
  background-size: cover;
  background-position: center center;
}
.box-card {
  max-width: 400px;
  margin: 0 auto;
}
</style>
