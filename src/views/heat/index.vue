<template>
   <div>
    <el-row :gutter="20">
  <!-- <el-col :span="8"> <el-input placeholder="搜索未来N天的天气情况" v-model="days" style="padding-bottom:10px;">
          </el-input></el-col>
  <el-col :span="4"><el-button type="primary"  v-on:click="search">搜索</el-button></el-col> -->
  <el-col :span="4"><el-button type="primary" style="margin-left:15px; "  @click="addDeploy('ruleForm')" >添加</el-button>
  </el-col>
 <!-- 新增企业弹窗start -->
  <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog">
  <el-form :model="ruleForm"   ref="ruleForm" label-width="100px" class="demo-ruleForm">
   <el-form-item label="时间" prop="year">
   <div class="block">
    <el-date-picker
      v-model="ruleForm.year"
      type="year"
      placeholder="选择年" value-format="yyyy">
    </el-date-picker>
  </div>
  </el-form-item>
  <el-form-item label="起始日期" prop="startDate">
    <div class="block">
    <el-date-picker
      v-model="ruleForm.startDate"
      type="date"
      placeholder="选择日期" value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
  </el-form-item>
  <el-form-item label="结束日期" prop="endDate">
    <div class="block">
    <el-date-picker
      v-model="ruleForm.endDate"
      type="date"
      placeholder="选择日期" value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
  </el-form-item>
  <el-row>
  </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="callOf('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="saveDeploy('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<!-- 新增企业弹窗end -->
</el-row>
<el-table
            ref="testTable"
            class="gtable"
             :header-cell-style="{
            'background-color': '#f6f6f6',
             }"      
            :data="tableData"
            border
            >
             <el-table-column
              prop="year"
              label="日期"
              sortable>
            </el-table-column>
            <el-table-column
              prop="startDate"
              label="起始日期"
              sortable>
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="结束日期"
              sortable>
            </el-table-column>
                <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  type="text"
                  icon='el-icon-edit-outline'
                 @click="editDeploy(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  type="text"
                  icon='el-icon-close'
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
           <!-- <el-pagination
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
export default {
  data() {
    return {
      tableData: [],
      days: '',
      // 默认每页数据量
      // pagesize: 10,
      // 默认高亮行数据id
      // highlightId: -1,
      // 当前页码
      // currentPage: 1,
      // 查询的页码
      // start: 1,
      // 默认数据总数
      // totalCount: 1000,
      dialogFormVisible: false,
      // highestTemperature: '',
      // lowestTemperature: '',
      // windDirection: '',
      // windLevel: ''
      ruleForm: {
        year: '',
        startDate: '',
        endDate: ''
      },
      formLabelWidth: '80px',
      titleMap: {
        addDeploy: '增加配置',
        editDeploy: '修改配置'
      },
      dialogStatus: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
    callOf(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    closeDialog(done) {
      this.dialogFormVisible = false
      this.$refs['ruleForm'].resetFields()
    },
    // 每页显示数据量变更
    // handleSizeChange: function(val) {
    //   this.pagesize = val
    //   this.loadData(this.currentPage, this.pagesize)
    // },
    // 页码变更
    // handleCurrentChange: function(val) {
    //   this.currentPage = val
    //   this.loadData(this.currentPage, this.pagesize)
    // },
    // 查询
    /* search: function() {
      var dateInfo = {
        id: this.id,
        endDate: this.endDate,
        startDate: this.startDate,
        year: this.year
      }
      if (this.days === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        // var url = '/heating/periods/latest'
        axios.get('/heating/periods/latest', dateInfo).then((response) => {
          if (response.data.msg === 'success') {
            var data = response.data.data
            this.tableData = data
            this.totalCount = response.data.data.total
          }
        })
      }
    }, */
    // 删除
    handleDelete: function(index, row) {
      this.$confirm('确定删除该时间?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var url = '/heating/periods/year/' + row.year
        // console.log(url)
        axios.delete(url, {
          params: {
            id: row.id
          }
        }
        ).then((response) => {
          console.log(response.data)
          if (response.data.msg === 'success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.loadData(this.currentPage, this.pagesize)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 添加天气
    addDeploy: function(formName) {
      this.dialogFormVisible = true
      this.dialogStatus = 'addDeploy'
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    // 编辑
    editDeploy: function(index, row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'editDeploy'
      this.$nextTick(() => {
        this.ruleForm.year = row.year
        this.ruleForm.startDate = row.startDate
        this.ruleForm.endDate = row.endDate
        this.id = row.id
      })
    },
    // 保存 新增
    saveDeploy: function(formName) {
      if (this.dialogStatus === 'editDeploy') {
        var editDeploy = {
          id: this.id,
          year: this.ruleForm.year,
          startDate: this.ruleForm.startDate,
          endDate: this.ruleForm.endDate
        }
        // console.log(editDeploy)
        axios.put('/heating/periods', editDeploy).then((response) => {
          if (response.data.msg === 'success') {
            this.dialogFormVisible = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.$refs['ruleForm'].resetFields()
            this.loadData(this.currentPage, this.pagesize)
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      } else if (this.dialogStatus === 'addDeploy') {
        var jsonData = {
          id: this.ruleForm.id,
          year: this.ruleForm.year,
          startDate: this.ruleForm.startDate,
          endDate: this.ruleForm.endDate
        }
        console.log(jsonData)
        axios.post('/heating/periods', jsonData).then((response) => {
          if (response.data.msg === 'success') {
            this.dialogFormVisible = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$refs['ruleForm'].resetFields()
            this.loadData(this.currentPage, this.pagesize)
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 获取对应登录用户的列表
    loadData: function(pageNumber, pageSize) {
      axios.get('/heating/periods', {
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
    }
  }
}
</script>