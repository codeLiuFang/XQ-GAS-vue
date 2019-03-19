<template>
   <div class="pbody">
<el-row :gutter="20">
  <el-col :span="4"> <el-input placeholder="请输入单位名称进行查询"  v-model="companyNamesearch"  style="padding-bottom:10px; margin-left:15px; ">
          </el-input></el-col>
      <el-col :span="4"><el-button type="primary" v-on:click="searchByCompanyId">查询</el-button></el-col>
  <el-col :span="4">
  <el-select v-model="selectStatus" @change = "changeStatus" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </el-col>
   <el-col :span="6"> <div class="block">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']" 
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </div></el-col>
  <el-col :span="4"><el-button type="primary" v-on:click="searchByDate">查询</el-button></el-col>
</el-row>
<el-table
            ref="testTable"       
            :data="tableData"
            class="gtable"
            :header-cell-style="{
            'background-color': '#f6f6f6',
             }"
            border
            :default-sort = "{prop: 'companyName', order: 'ascending'}"
            >
             <el-table-column
              prop="estimatedDate"
              label="计划日期"
              sortable>
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="单位名称"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="estimatedAmount"
              label="计划用气(元/方)"
              sortable>
               <template scope = "scope">
                  <el-input v-if = "scope.row.isEdit" v-model = "scope.row.estimatedAmount"></el-input>
                  <label v-if = "!scope.row.isEdit">{{scope.row.estimatedAmount===0 ? '': scope.row.estimatedAmount}}</label>
              </template>
            </el-table-column>
            <el-table-column
              prop="realAmount"
              :formatter="formaterAmount"
              label="实际用气"
              sortable>
            </el-table-column>
             <el-table-column
              prop="reportPerson"
              label="填报人"
              sortable>
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
                  type="warning" v-if="scope.row.estimatedAmount != '' &&scope.row.isEdit"
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
import axios from '@/utils/request'
export default {
  data() {
    return {
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
  created: function() {
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
    loadData: function(pageNumber, pageSize) {
      axios.get('/gas/plans', {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize
        }
      }).then(response => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          for (let i = 0; i < data.length; i++) {
            data[i].isEdit = false
          }
          this.tableData = data
          this.totalCount = response.data.data.total
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
        reportPerson: ''
      }
      axios.post(url, report).then((response) => {
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
    },
    // 按照企业id搜索上报记录
    searchByCompanyId: function() {
      if (this.companyNamesearch === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        var url = '/companies/name/' + this.companyNamesearch
        axios.get(url, {
          params: {
            pageNumber: pageNumber,
            pageSize: pageSize
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
      /* var companyNamesearch = this.companyNamesearch
      if (companyNamesearch !== '') {
        this.tableData = this.tableData.filter(function(item, index, arr) {
          // console.log(item.companyName)
          return (item.companyName === companyNamesearch)
        })
        // this.tableData = (searchData.length === 0 ? this.tableData : searchData)
      } else {
        this.loadData(this.currentPage, this.pagesize)
      } */
    },
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
            for (let i = 0; i < data.length; i++) {
              data[i].isEdit = false
            }
            this.tableData = data
            this.totalCount = response.data.data.total
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
            this.tableData = data
            this.totalCount = response.data.data.total
          }
        })
      }
    }
  }
}
</script>
<style scoped>
@import '../../styles/common.css';
</style>
