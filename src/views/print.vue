<template>
  <div class="print-container">
    <div class="ql-editor">
      <el-button
        class="btn-print noprint"
        type="primary"
        plain
        icon="el-icon-printer"
        @click="handlePrint"
      >
        打印
      </el-button>
      <table class="table-wrapper btm-border-none" border="1" cellspacing="0">
        <thead class="table-header">
          <tr>
            <th colspan="4" class="table-title">
              {{ title }}
            </th>
          </tr>
          <tr class="h-50">
            <td width="25%">日期：{{ date }}</td>
            <td width="25%">星期：{{ week }}</td>
            <td width="25%">天气：{{ weather }}</td>
            <td width="25%">等级：{{ level }}</td>
          </tr>
          <tr class="h-40">
            <td width="50%" colspan="2">带班领导：{{ leader }}</td>
            <td width="50%" colspan="2">值班人员：{{ user }}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4" valign="top">
              <div v-html="content" />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="h-50 table-bottom">
            <td width="50%" colspan="2">带班领导签字：</td>
            <td width="50%" colspan="2">值班员签字：</td>
          </tr>
          <tr>
            <td colspan="4" class="btm-border-none page-footer">
              乡镇森林防灭火值班管理系统
              软件开发：湖南省平江县大洲乡农业综合服务中心 钟咨 邱河海 何旭东
              2023年 软件使用联系：13874099950（微信）
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Print',
  data() {
    return {
      date: '',
      week: '',
      content: '',
      weather: '',
      level: '',
      leader: '',
      user: '',
      title: ''
    }
  },
  created() {
    const firelog = localStorage.getItem('firelog')
    try {
      const { createDate, content, weather, level, leader, user, street } =
        JSON.parse(firelog)
      this.content = content
      this.weather = weather
      this.level = level
      this.leader = leader
      this.user = user
      this.title = `${street}森林防火值班日志`
      const [date] = createDate.split(' ')
      this.date = date
      const weeks = ['日', '一', '二', '三', '四', '五', '六']
      this.week = weeks[new Date(createDate).getDay()]
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    handlePrint() {
      window.print()
    }
  }
}
</script>
<style lang="scss" scoped>
.print-container {
  width: 90%;
  max-width: 1200px;
  margin: 0px auto;

  ::v-deep img {
    border-radius: 4px;
    // width: calc(33.33% - 2px);
    margin: 5px 1px;
    max-height: 70vh;
    // aspect-ratio: 3 / 4.2;
  }

  .table-wrapper {
    width: 100%;
    min-height: 100vh;
    border-top: none;
    border-left: none;
    border-right: none;
    th {
      border-collapse: collapse;
      border-color: #999;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-bottom: 1px solid;
      padding: 5px 9px;
      font-size: 14px;
      font-weight: normal;
    }
    td {
      border-collapse: collapse;
      padding: 5px 9px;
      font-size: 14px;
      font-weight: normal;
      word-break: break-all;
      border-top: none;
      border-right: none;
      border-color: #999;
      border-bottom: 1px solid;
      &:last-of-type {
        border-right: 1px solid;
      }
    }
    .table-title {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      width: 100%;
      td {
        border-top: none;
        border-right: none;
        border-left: none;
      }
    }
    tbody {
      td {
        font-size: 16px;
        border-bottom: none;
      }
    }
    .table-bottom {
      td {
        border-top: none;
        border-top: 1px solid;
      }
    }
    .page-footer {
      font-size: 12px;
      padding: 5px 0;
      border-right: none !important;
      border-left: none;
    }
  }
}
.h-40 {
  height: 40px;
}
.h-50 {
  height: 50px;
}
.btm-border-none {
  border-bottom: none !important;
}
@media print {
  .noprint {
    display: none;
  }
  .print-container {
    width: 100%;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    page-break-after: avoid;
  }
  table,
  figure,
  img {
    page-break-inside: avoid;
  }
  ::v-deep .ql-editor {
    padding: 0;
  }
}
.btn-print {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}
</style>
