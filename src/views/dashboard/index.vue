<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">森林防火</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  height: calc(100vh - 50px);
  background-image: url("../../assets/bgc.jpg");
  background-size: cover;
  background-position: center center;
}
.dashboard {
  // &-container {
  //   margin: 30px;
  // }
  &-text {
    font-family: 黑体;
    font-size: 60px;
    letter-spacing: 0.3em;
    line-height: 46px;
    margin-top: 70px;
    color: green;
  }
}
</style>
