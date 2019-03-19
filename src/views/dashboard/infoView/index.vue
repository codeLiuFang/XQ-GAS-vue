<template>
   <div>
     <!-- <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group> -->

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <double-line :chart-data="lineChartData"></double-line>
    </el-row>
<!-- <el-table
            ref="testTable"       
            :data="tableData"
            style="width:100%"
            >
             <el-table-column
              prop="date"
              label="日期"
              sortable>
            </el-table-column>
            <el-table-column
              prop="predictedAmount"
              label="预测量"
              sortable>
            </el-table-column>
             <el-table-column
              prop="realAmount"
              label="实际量"
              sortable>
            </el-table-column>
          </el-table>
           <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount">
              </el-pagination>  -->
   </div>   
   </template>
<script>
import axios from '@/utils/request'
import DoubleLineChart from '../../dashboard/admin/components/DoubleLineChart'
// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145]
//   }
//   // messages: {
//   //   expectedData: [200, 192, 120, 144, 160, 130, 140],
//   //   actualData: [180, 160, 151, 106, 145, 150, 130]
//   // },
//   // purchases: {
//   //   expectedData: [80, 100, 121, 104, 105, 90, 100],
//   //   actualData: [120, 90, 100, 138, 142, 130, 130]
//   // },
//   // shoppings: {
//   //   expectedData: [130, 140, 141, 142, 145, 150, 160],
//   //   actualData: [120, 82, 91, 154, 162, 140, 130]
//   // }
// }
export default {
  components: {
    'double-line': DoubleLineChart
  },
  data() {
    return {
      // tableData: [],
      // name: '',
      // // 下拉菜单选项
      // select: '',
      // // 默认每页数据量
      // pagesize: 10,
      // // 默认高亮行数据id
      // highlightId: -1,
      // // 当前页码
      // currentPage: 1,
      // // 查询的页码
      // start: 1,
      // // 默认数据总数
      // totalCount: 1000,
      // date: '',
      // predictedAmount: '',
      // realAmount: '',
      // lineChartData: lineChartData.newVisitis,
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
  created: function() {
    this.loadData()
  },
  methods: {
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type]
    // },
    // 每页显示数据量变更
    // handleSizeChange: function(val) {
    //   this.pagesize = val
    //   this.loadData(this.currentPage, this.pagesize)
    // },
    // // 页码变更
    // handleCurrentChange: function(val) {
    //   this.currentPage = val
    //   this.loadData(this.currentPage, this.pagesize)
    // },
    // 获取列表
    loadData: function() {
      var url = '/predictions/latest/30'
      axios.get(url).then((response) => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
        if (response.data.msg === 'success') {
          var data = response.data.data
          // console.log(response.data)
          // this.tableData = data
          // this.totalCount = response.data.data.total
          // console.log(data)
          for (let i = data.length - 1; i >= 0; i--) {
            this.lineChartData.xAxisData.push(data[i].date)
            this.lineChartData.yAxisData1.value.push(data[i].predictedAmount)
            this.lineChartData.yAxisData2.value.push(data[i].realAmount)
          }
          // this.lineChartData.xAxisData = ['1', '2', '3']
          // this.lineChartData.yAxisData1.value = ['100', '200', '300']
          // this.lineChartData.yAxisData2.value = ['500', '600', '700']
        }
      })
    }
  }
}
</script>