<template>
   <div class="pbody">
    <el-row :gutter="20">
  <el-col :span="8"> <el-input placeholder="搜索未来N天的天气情况"  v-model="days" style="padding-bottom: 20px; margin-left:15px; ">
          </el-input></el-col>
  <el-col :span="4"><el-button type="primary" style='background-color:#304156; border: none' icon="el-icon-search"  v-on:click="search">搜索</el-button></el-col>
  <!-- <el-col :span="4"><el-button type="primary"  @click="addWeather('ruleForm')" >添加</el-button>
  </el-col> -->
 <!-- 新增企业弹窗start -->
  <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog">
  <el-form :model="ruleForm"   ref="ruleForm" label-width="60px" class="demo-ruleForm">
   <el-form-item label="时间" prop="date">
    <el-input v-model="ruleForm.date"></el-input>
  </el-form-item>
  <el-form-item label="最低温" prop="lowestTemperature">
    <el-input v-model="ruleForm.lowestTemperature" width="100px"></el-input>
  </el-form-item>
  <el-form-item label="最高温" prop="highestTemperature">
    <el-input v-model="ruleForm.highestTemperature"></el-input>
  </el-form-item>
   <el-form-item label="天气" prop="weather">
    <el-input v-model="ruleForm.weather"></el-input>
  </el-form-item>
   <el-form-item label="风向" prop="windDirection">
    <el-input v-model="ruleForm.windDirection"></el-input>
  </el-form-item>
  <el-form-item label="风速" prop="windLevel">
    <el-input v-model="ruleForm.windLevel"></el-input>
  </el-form-item>  
  <el-row>
  </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveWeather('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<!-- 新增企业弹窗end -->
</el-row>
<el-table
            ref="testTable"       
            :data="tableData"
            class="gtable"
           :header-cell-style="{
            'background-color': '#f6f6f6',
             }"
            border
            >
             <el-table-column
              prop="date"
              label="日期"
              sortable>
            </el-table-column>
            <el-table-column
              prop="newData"
              :formatter="formatterColumn"
              label="气温"
              sortable>
            </el-table-column>
            <el-table-column
              prop="weather"
              label="天气"
              sortable>
            </el-table-column>
             <el-table-column
              prop="windDirection"
              label="风向"
              sortable>
            </el-table-column>
             <el-table-column
              prop="windLevel"
              label="风速"
              sortable>
            </el-table-column>
           <!-- <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  type="primary"
                 @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
      days: '',
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
      dialogFormVisible: false,
      // highestTemperature: '',
      // lowestTemperature: '',
      // windDirection: '',
      // windLevel: ''
      ruleForm: {
        date: '',
        weather: '',
        id: '',
        highestTemperature: '',
        lowestTemperature: '',
        windDirection: '',
        windLevel: ''
      },
      formLabelWidth: '80px',
      titleMap: {
        addWeather: '添加天气信息',
        editWeather: '更新天气信息'
      },
      dialogStatus: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
    formatterColumn(row, column) {
      var h = row.highestTemperature
      var l = row.lowestTemperature
      var newData = l + '~' + h
      return newData
    },
    callOf(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    closeDialog(done) {
      this.dialogFormVisible = false
      this.$refs['ruleForm'].resetFields()
    },
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
    // 搜索近N天的天气
    search: function() {
      if (this.days === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        var url = '/weather/forecast/' + this.days
        axios.get(url, {
          params: {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize
          }
        }).then((response) => {
          if (response.data.msg === 'success') {
            var data = response.data.data
            this.tableData = data
            this.totalCount = response.data.data.total
          }
        })
      }
    },
    // 添加天气
    addWeather: function(formName) {
      this.dialogFormVisible = true
      this.dialogStatus = 'addWeather'
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.ruleForm.companyContacts.length = 1
      })
    },
    // 编辑
    handleEdit: function(index, row) {
      this.ruleForm.date = row.date
      this.ruleForm.weather = row.weather
      this.dialogFormVisible = true
      this.ruleForm.highestTemperature = row.highestTemperature
      this.ruleForm.lowestTemperature = row.lowestTemperature
      this.ruleForm.windDirection = row.windDirection
      this.ruleForm.windLevel = row.windLevel
    },
    // 保存 新增
    saveWeather: function(formName) {
      if (this.dialogStatus === 'editWeather') {
        var editWeather = {
          id: this.ruleForm.id,
          date: this.ruleForm.date,
          weather: this.ruleForm.weather,
          highestTemperature: this.ruleForm.highestTemperature,
          lowTemperature: this.ruleForm.lowestTemperature,
          windDirection: this.ruleForm.windDirection,
          windLevel: this.ruleForm.windLevel
        }
        console.log(editWeather)
        axios.put('/weather', editWeather).then((response) => {
          if (response.data.msg === 'success') {
            this.dialogFormVisible = false
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
      } else if (this.dialogStatus === 'addWeather') {
        var jsonData = {
          date: this.ruleForm.date,
          weather: this.ruleForm.weather,
          id: this.ruleForm.id,
          highestTemperature: this.ruleForm.highestTemperature,
          lowestTemperature: this.ruleForm.lowestTemperature,
          windDirection: this.ruleForm.windDirection,
          windLevel: this.ruleForm.windLeve
        }
        axios.post('/weather', jsonData).then((response) => {
          if (response.data.msg === 'success') {
            this.dialogFormVisible = false
            this.$message({
              message: '添加成功',
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
    },
    // 获取对应登录用户的列表
    loadData: function(pageNumber, pageSize) {
      axios.get('/weather', {
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
<style>
@import '../../styles/common.css';
</style>
