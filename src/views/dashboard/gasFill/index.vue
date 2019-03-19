/* 外部填报 */
<template>
<div class="pbody">
<el-card class="box-card box-card-style">
  <div  class="text item">
     <el-form  :model="companyinfo" class="demo-form-inline">
  <el-form-item label="企业名称:">
    <el-form-item > {{ companyinfo.companyName }}</el-form-item>
  </el-form-item>
   <el-form-item label="企业地址:">
    <el-form-item > {{ companyinfo.companyAddress }}</el-form-item>
  </el-form-item>
  <el-form-item label="用气地点:">
    <el-form-item > {{ companyinfo.placeOfGasNeeded }}</el-form-item>
  </el-form-item>
  <el-form-item label="经营范围:">
    <el-form-item > {{ companyinfo.businessScope }}</el-form-item>
  </el-form-item>
  <el-form-item label="用气性质:">
    <el-form-item > {{ companyinfo.purposesOfGasUse }}</el-form-item>
  </el-form-item>
</el-form>
  </div>
</el-card>


<el-row :gutter="10">
   <el-col :md="6" :lg="6"> <div class="block">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']" 
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </div></el-col>
  <el-col :md="4" :lg="4"><el-button type="primary" v-on:click="searchByDate">查询</el-button></el-col>
</el-row>
<el-table
            ref="testTable"       
            :data="tableData"
            style="width:100%"
            border
            :default-sort = "{prop: 'companyName', order: 'ascending'}"
            >
             <el-table-column
              prop="estimatedDate"
              label="计划日期"
              sortable>
            </el-table-column>
            <!-- <el-table-column
              prop="companyName"
              label="单位名称"
              sortable>
            </el-table-column> -->
            <el-table-column
              prop="estimatedAmount"
              label="计划用气(方)"
              sortable>
               <template scope = "scope">
                  <el-input v-if = "scope.row.isEdit" v-model = "scope.row.estimatedAmount"></el-input>
                  <label v-if = "!scope.row.isEdit">{{scope.row.estimatedAmount===0 ? '': scope.row.estimatedAmount}}</label>
              </template>
            </el-table-column>
             <el-table-column
              prop="reportPerson"
              label="填报人"
              sortable>
               <template scope = "scope">
                  <el-input v-if = "scope.row.isEdit" v-model = "scope.row.reportPerson"></el-input>
                  <label v-if = "!scope.row.isEdit">{{scope.row.reportPerson===0 ? '': scope.row.reportPerson}}</label>
              </template>
            </el-table-column>
             <el-table-column
              prop="reportTime"
              label="填报时间"
              value-format="yyyy-MM-dd"
              sortable>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  type="primary" v-if="!scope.row.isEdit"
                 @click="handleEdit(scope.$index, scope.row)">填报</el-button>
                  <el-button
                  size="small"
                  type="warning" v-if="scope.row.estimatedAmount!= '' &&scope.row.isEdit"
                 @click="handleSave(scope.$index, scope.row)">保存</el-button>
              </template>
            </el-table-column>
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
import { mapGetters } from 'vuex'
import axios from '@/utils/request'
export default {
  data() {
    return {
      companyinfo: {
        companyName: '',
        companyAddress: '',
        placeOfGasNeeded: '',
        businessScope: '',
        purposesOfGasUse: ''
      },
      tableData: [],
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
      totalCount: 1000,
      // 搜索
      dateRange: '',
      companyNamesearch: '',
      companyId: '',
      selectStatus: '',
      radio: '1',
      options: [{
        value: '选项1',
        label: '已填报'
      }, {
        value: '选项2',
        label: '未填报'
      }],
      value: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created: function() {
    // console.log(this.name)
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
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
    // 格式化表格0
    formaterAmount(row, colum) {
      const arr = row[colum.property]
      return arr === 0 ? '' : arr
    },
    // 获取对应登录用户的列表
    loadData: function(pageNumber, pageSize) {
      axios.get('/companies/current', {
        // params: {
        //   pageNumber: this.pageNumber,
        //   pageSize: this.pageSize
        // }
      }).then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data
          this.companyinfo.companyName = data.companyName
          this.companyinfo.companyAddress = data.companyAddress
          this.companyinfo.placeOfGasNeeded = data.placeOfGasNeeded
          this.companyinfo.businessScope = data.businessScope
          this.companyinfo.purposesOfGasUse = data.purposesOfGasUse.join('、')
          var roleCompanyName = data.companyName
          var planurl = '/companies/name/' + roleCompanyName
          axios.get(planurl, {
            // params: {
            //   pageNumber: this.pageNumber,
            //   pageSize: this.pageSize
            // }
          }).then((response) => {
            if (response.data.msg === 'success') {
              var companyid = response.data.data.rows[0].id
              this.companyId = companyid
              var planGasUrl = '/companies/' + companyid + '/gas/plans'
              axios.get(planGasUrl, {
                params: {
                  pageNumber: pageNumber,
                  pageSize: pageSize
                }
              }).then((response) => {
                if (response.data.msg === 'success') {
                  var data = response.data.data.rows
                  for (let i = 0; i < data.length; i++) {
                    data[i].isEdit = false
                  }
                  this.tableData = data
                  this.totalCount = response.data.data.total
                  console.log(this.totalCount)
                }
              })
            }
          })
        }
      })
    },
    handleEdit: function(index, row) {
      // this.initUpdateVal = val.realAmount
      row.isEdit = true
    },
    // 填报 保存
    handleSave: function(index, row) {
      var url = '/companies/' + row.companyId + '/gas/plans'
      var report = {
        estimatedAmount: row.estimatedAmount,
        reportPerson: row.reportPerson
      }
      report.reportPerson = row.reportPerson === '' ? this.name : row.reportPerson
      // console.log(report)
      axios.post(url, report).then((response) => {
        if (response.data.msg === 'success') {
          this.$message({
            message: '填报成功',
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
    },
    // 按照企业id搜索上报记录
    /*  searchByCompanyId: function() {
      if (this.companyNamesearch === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        var url = '/companies/name/' + this.companyNamesearch
        axios.get(url, {
          params: {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
          }
        }).then((response) => {
          if (response.data.msg === 'success') {
            console.log(response.data.data.rows)
            if (response.data.data.rows.length > 0) {
              var companyid = response.data.data.rows[0].id
              var planurl = '/companies/' + companyid + '/gas/plans'
              axios.get(planurl, {
                params: {
                  pageNumber: this.pageNumber,
                  pageSize: this.pageSize
                }
              }).then((response) => {
                if (response.data.msg === 'success') {
                  var data = response.data.data.rows
                  this.tableData = data
                  this.totalCount = response.data.data.total
                }
              })
            } else {
              this.tableData = ''
            }
          }
        })
      }
    }, */
    // 按时间区间搜索上报记录
    searchByDate: function() {
      if (this.dateRange === '') {
        this.$message({
          showClose: true,
          message: '请选择日期',
          type: 'warning'
        })
      } else {
        var dateRange = this.dateRange
        var url = '/gas/plans/' + dateRange[0] + '~' + dateRange[1]
        axios.get(url, {
          params: {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
          }
        }).then((response) => {
          if (response.data.msg === 'success') {
            var data = response.data.data.rows
            var jsonData = []
            jsonData = data
            var companyId = this.companyId
            this.tableData = jsonData.filter(function(item, index, arr) {
              return (item.companyId === companyId)
            })
            for (let i = 0; i < data.length; i++) {
              data[i].isEdit = false
            }
            this.totalCount = this.tableData.length
          }
        })
      }
    },
    // 按照状态查询上报
    changeStatus(val) {
      var obj = {}
      obj = this.options.find((item) => { return item.value === val })
      if (obj !== '' && obj !== undefined) {
        this.selectStatus = obj.label
        var selectedStatus = this.selectStatus
        var url = '/gas/plans/status/' + selectedStatus
        axios.get(url, {
          params: {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
          }
        }).then((response) => {
          if (response.data.msg === 'success') {
            var data = response.data.data.rows
            var jsonData = []
            jsonData = data
            var companyId = this.companyId
            this.tableData = jsonData.filter(function(item, index, arr) {
              return (item.companyId === companyId)
            })
            console.log(this.tableData)
            // this.tableData = data
            this.totalCount = this.tableData.length
          }
        })
      }
    }
  }
}
</script>
<style>
@import '../../../styles/common.css';
 .el-form-item--small.el-form-item {
    margin-bottom: 0px;
}
.el-form-item {
    margin-bottom: 0px;
}
</style>
