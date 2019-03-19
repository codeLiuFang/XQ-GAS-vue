<template>
   <div class="pbody">
<el-table
            ref="testTable"       
            :data="tableData"
             border
            class="gtable tb-edit"
            :header-cell-style="{
            'background-color': '#f6f6f6',
             }"
             highlight-current-row @row-click="handleCurrentChange"
            >
             <el-table-column
              prop="date"
              label="日期"
              sortable>
            </el-table-column>
            <el-table-column
              prop="predictedAmount"
              label="分析模型预测用量"
              sortable>
            </el-table-column>
             <el-table-column
              prop="realAmount"
              label="实际燃气用量"
              sortable>
            </el-table-column>
              <el-table-column
              prop="staffPredictionAmount"
              label="人工预测用量"
              sortable>
              <template scope = "scope">
                  <el-input size="small" v-model="scope.row.staffPredictionAmount" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> <span>{{scope.row.staffPredictionAmount}}</span>
              </template>
            </el-table-column>
             <!-- <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  type="primary" v-if="!scope.row.isEdit"
                 @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                  size="small"
                  type="warning" v-if="scope.row.staffPredictionAmount != '' &&scope.row.isEdit"
                 @click="handleSave(scope.$index, scope.row)">保存</el-button>
              </template>
            </el-table-column> -->
          </el-table>
           <el-pagination class="pstyle"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount">
              </el-pagination> 
   </div>   
   </template>
<script>
import axios from '@/utils/request'
export default {
  data() {
    return {
      tableData: [],
      name: '',
      // 下拉菜单选项
      select: '',
      // 默认每页数据量
      pagesize: 10,
      // 默认高亮行数据id
      highlightId: -1,
      // 当前页码
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type]
    // },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 获取列表
    loadData: function(pageNumber, pageSize) {
      axios.get('/predictions', {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize
        }
      }).then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.tableData = data
          this.totalCount = response.data.data.total
        }
      })
    },
    // handleEdit: function(index, row) {
    //   // this.initUpdateVal = val.realAmount
    //   row.isEdit = true
    //   console.log(index)
    // },
    // 填报 保存
    handleEdit: function(index, row) {
      var jsondata = {
        id: row.id,
        staffPredictionAmount: row.staffPredictionAmount
      }
      axios.put('/predictions', jsondata).then((response) => {
        if (response.data.msg === 'success') {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.loadData(this.currentPage, this.pagesize)
        } else {
          this.$message({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style>
@import '../../styles/common.css';
.tb-edit .el-input { 
  display: none 
  } 
.tb-edit .current-row .el-input 
{ display: block } 
.tb-edit .current-row .el-input+span
 { display: none }

</style>
