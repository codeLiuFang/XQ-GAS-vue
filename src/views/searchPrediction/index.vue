<template>
   <div>
     <!-- <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group> -->

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <double-line :chart-data="lineChartData"></double-line>
    </el-row>

   </div>   
   </template>
<script>
import axios from '@/utils/request'
import DoubleLineChart from '../dashboard/admin/components/DoubleLineChart'
export default {
  components: {
    'double-line': DoubleLineChart
  },
  data() {
    return {
      lineChartData: {
        xAxisData: [],
        yAxisData1: {
          y: '预测值',
          value: []
        },
        yAxisData2: {
          y: '实际值',
          value: []
        }
      }
    }
  },
  methods: {
    // 获取列表
    loadData: function(days) {
      axios.get('/predictions/latest/ + days', {
        params: {
          days: days
        }
      }).then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
      })
    }
  }
}
</script>