<template>
   <div class="fbody">
     <el-row :gutter="20">
  <el-col :span="8"> <el-input placeholder="请输入内容" v-model="name" style="padding-bottom:10px; border-radius:10px; margin-left:15px; margin-right:30px">
          </el-input></el-col>
  <el-col :span="8"><el-button type="primary" style='background-color:#304156; border: none' icon="el-icon-search"  v-on:click="search">搜索</el-button>
   <el-button  icon="el-icon-refresh"  type="primary" style='background-color:#00a448; color: white; border: none' @click="resetForm()">重置</el-button>
 <el-button type="primary" icon="el-icon-plus" style='background-color:#007eff; border: none' @click="addCompany('ruleForm')" >添加</el-button>
  <el-button type="success" icon="el-icon-close" style='background-color:#3c444e; border: none' @click="deletenames">批量删除</el-button></el-col>
 <!-- 新增企业弹窗start -->
  <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" v-if='dialogFormVisible' :before-close="closeDialog">
  <el-form :model="ruleForm"   ref="ruleForm" label-width="100px" class="demo-ruleForm">
   <el-form-item label="企业名称" prop="companyName">
    <el-input v-model="ruleForm.companyName"></el-input>
  </el-form-item>
   <el-form-item label="企业简称" prop="companyAbbreviation">
    <el-input v-model="ruleForm.companyAbbreviation"></el-input>
  </el-form-item>
  <el-form-item label="用户名" prop="loginId">
    <el-input v-model="ruleForm.loginId" width="100px"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="ruleForm.password" type="password"></el-input>
  </el-form-item>
   <el-form-item label="企业地址" prop="companyAddress">
    <el-input v-model="ruleForm.companyAddress"></el-input>
  </el-form-item> 

  <el-row>
  <el-col :span="8">
    <el-form-item v-for="(companyContact, index) in ruleForm.companyContacts"
     :label="'联系人'+ index"
     :key="companyContact.key"
     :prop="'companyContacts.' + index + '.contactName'">
    <el-input v-model="companyContact.contactName"></el-input></el-form-item>
  </el-col>
  <el-col :span="8">
    <el-form-item 
       v-for="(companyContact, index) in ruleForm.companyContacts" 
       :label="'联系方式'+ index"
       :key="companyContact.key"
       :prop="'companyContacts.' + index + '.contactNumber'"
       :rules="{
          required: true, message: '联系方式不能为空', trigger: 'blur'
        }"
       >
      <el-input v-model="companyContact.contactNumber"></el-input> <el-button class="del"  @click.prevent="removeCompany(index)">删除</el-button>
    </el-form-item></el-col>
  </el-row>
    <el-form-item>
      <el-button @click="addContracts">新增联系方式</el-button> 
    </el-form-item>
    <el-form-item label="用气地点" prop="placesOfGasNeeded">
    <el-input v-model="ruleForm.placesOfGasNeeded"></el-input>
  </el-form-item>
  <el-form-item label="用气性质" prop="purposesOfGasUse">
    <el-checkbox-group v-model="ruleForm.purposesOfGasUse">
      <el-checkbox label="采暖"></el-checkbox>
      <el-checkbox label="生产"></el-checkbox>
      <el-checkbox label="生活"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
   <el-form-item label="经营范围" prop="businessScope">
    <el-input v-model="ruleForm.businessScope">m³</el-input>
  </el-form-item>
  <el-form-item label="燃气表编号" prop="meters">
    <el-input v-model="ruleForm.meters">m³</el-input>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="callOf('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="saveCompany('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<!-- 新增企业弹窗end -->
</el-row>
      <el-table class="gtable"
           :header-cell-style="{
            'background-color': '#f6f6f6',
             }"
            ref="testTable"       
            :data="tableData"
            border
            :default-sort = "{prop: 'companyName', order: 'ascending'}"
             @selection-change="handleSelectionChange"
             @row-click="handleclick"
            :row-class-name = "tableRowClassName"
            >
            <el-table-column type="expand">
        <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="企业名称">
            <span>{{ props.row.companyName }}</span>
          </el-form-item>
          <el-form-item label="企业地址">
            <span>{{ props.row.companyAddress }}</span>
          </el-form-item>
          <el-form-item label="用气地点">
            <span>{{ props.row.placesOfGasNeeded }}</span>
          </el-form-item>
          <el-form-item label="经营范围">
            <span>{{ props.row.businessScope }}</span>
          </el-form-item>
          <!-- <el-form-item label="联系人">
            <span>{{ props.row.companyContacts[0].contactName}}</span>
          </el-form-item> -->
          <!-- <el-form-item label="联系方式">
            <span>{{ props.row.companyContacts[0].contactNumber }}</span>
          </el-form-item> -->
        </el-form>
      </template>
    </el-table-column>
            <el-table-column
              type="selection"
              >
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="企业名称"
              show-overflow-tooltip>
            </el-table-column>
           <!--  <el-table-column
              prop="companyContacts"
              label="联系人"
              sortable>
              <template slot-scope="scope">
              {{scope.row.companyContacts[0]}}
              </template>
            </el-table-column> -->
            <el-table-column
              prop="companyContacts"
              :formatter="formaterContracts"
              label="联系方式"
              sortable>
            </el-table-column>
            <el-table-column
              prop="purposesOfGasUse"
              :formatter="formaterGasUse"
              label="用气性质"
              sortable>
            </el-table-column>
            <el-table-column
              prop="dailyPeekOfGasConsumption"
              label="日高峰用气量（m³）"
              sortable>
            </el-table-column>
            <el-table-column
              prop="meters"
              :formatter="formaterMeters"
              label="燃气表编号"
              sortable>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                 type="text"
                  icon='el-icon-edit-outline'
                 @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                 type="text"
                   icon='el-icon-close'
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import { Base64 } from 'js-base64'
import axios from '@/utils/request'
export default {
  name: 'dashboard-admin',
  data() {
    return {
      tableData: [],
      // 多选数组
      multipleSelection: [],
      // 搜索条件
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
      totalCount: 1000,
      // dialogForm1Visible: false,
      formLabelWidth: '120px',
      ruleForm: {
        loginId: '',
        password: '',
        companyName: '',
        companyAbbreviation: '',
        companyAddress: '',
        purposesOfGasUse: [],
        // dailyPeekOfGasConsumption: '',
        businessScope: '',
        placesOfGasNeeded: '',
        companyContacts: [{
          contactName: '',
          contactNumber: ''
        }]
      },
      id: '',
      userId: '',
      dialogFormVisible: false,
      titleMap: {
        addCompany: '新增企业信息',
        editCompany: '编辑企业信息'
      },
      dialogStatus: '',
      meters: ''
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {
    formaterContracts(row, colum) {
      const arr = row[colum.property]
      var returnarry = []
      for (let i = 0; i < arr.length; i++) {
        returnarry.push(arr[i].contactNumber)
      }
      return returnarry.join('， ')
    },
    formaterGasUse(row, colum) {
      const arr = row[colum.property]
      var returnGasUse = []
      for (let i = 0; i < arr.length; i++) {
        returnGasUse.push(arr[i])
      }
      return returnGasUse.join(' 、')
    },
    formaterMeters(row, colum) {
      const arr = row[colum.property]
      var returnMeters = []
      for (let i = 0; i < arr.length; i++) {
        returnMeters.push(arr[i])
      }
      return returnMeters.join(', ')
    },
    // 从服务器读取数据
    loadData: function(pageNumber, pageSize) {
      axios.get('/companies', {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize
        }
      }).then((response) => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          console.log(response.data.data)
          this.tableData = data
          this.totalCount = response.data.data.total
        }
      })
    },
    addContracts() {
      const cope = {
        contactName: '',
        contactNumber: ''
      }
      this.ruleForm.companyContacts.push(cope)
    },
    removeCompany(index) {
      this.ruleForm.companyContacts.splice(index, 1)
    },
    callOf(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    closeDialog(done) {
      this.dialogFormVisible = false
      this.$refs['ruleForm'].resetFields()
    },
    // 新增
    addCompany: function(formName) {
      this.dialogFormVisible = true
      this.dialogStatus = 'addCompany'
      //  点击编辑后  重置添加项
      // this.ruleForm.password = ''
      // this.ruleForm.businessScope = ''
      // this.ruleForm.companyAddress = ''
      // this.ruleForm.companyName = ''
      // this.ruleForm.loginId = ''
      // this.ruleForm.placesOfGasNeeded = ''
      // this.ruleForm.purposesOfGasUse = []
      // for (let i = 0; i < this.ruleForm.companyContacts.length; i++) {
      //   this.ruleForm.companyContacts[i].contactName = ''
      //   this.ruleForm.companyContacts[i].contactNumber = ''
      // }
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
        this.ruleForm.companyContacts.length = 1
      })
    },
    // 根据id查询企业信息
    // 编辑
    handleEdit: function(index, row) {
      console.log(row)
      this.id = row.id
      this.userId = row.userId
      this.dialogFormVisible = true
      this.dialogStatus = 'editCompany'
      this.titleMap.editCompany = '编辑企业信息' + '--' + row.companyName
      this.$nextTick(() => {
        // 根据id获取企业信息接口暂时不能使用  目前使用绑定值方式
        if (row.companyContacts.length === 0) {
          row.companyContacts.push({
            contactName: '',
            contactNumber: ''
          })
        }
        this.ruleForm.password = row.password
        this.ruleForm.companyContacts = row.companyContacts
        this.ruleForm.companyContacts = row.companyContacts
        this.ruleForm.businessScope = row.businessScope
        this.ruleForm.companyAddress = row.companyAddress
        this.ruleForm.companyName = row.companyName
        this.ruleForm.companyAbbreviation = row.companyAbbreviation
        this.ruleForm.loginId = row.loginId
        this.ruleForm.placesOfGasNeeded = row.placesOfGasNeeded
        this.ruleForm.purposesOfGasUse = row.purposesOfGasUse
        this.ruleForm.meters = row.meters
      })
    },
    // 保存企业信息
    saveCompany: function(formName) {
      // 保存新增

      if (this.dialogStatus === 'addCompany') {
        var pwd = Base64.encode(this.ruleForm.password)
        this.ruleForm.password = pwd
        var jsonData = {
          loginId: this.ruleForm.loginId,
          password: pwd,
          companyName: this.ruleForm.companyName,
          companyAbbreviation: this.ruleForm.companyAbbreviation,
          companyAddress: this.ruleForm.companyAddress,
          purposesOfGasUse: this.ruleForm.purposesOfGasUse.join('、'),
          // dailyPeekOfGasConsumption: this.ruleForm.dailyPeekOfGasConsumption,
          businessScope: this.ruleForm.businessScope,
          placesOfGasNeeded: this.ruleForm.placesOfGasNeeded,
          companyContacts: this.ruleForm.companyContacts,
          meters: this.ruleForm.meters
        }
        // var jsonData = JSON.stringify(this.ruleForm)
        axios.post('/companies', jsonData).then((response) => {
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
      } else if (this.dialogStatus === 'editCompany') {
        var editpwd = Base64.encode(this.ruleForm.password)
        this.ruleForm.password = editpwd
        var editData = {
          loginId: this.ruleForm.loginId,
          password: editpwd,
          companyName: this.ruleForm.companyName,
          companyAbbreviation: this.ruleForm.companyAbbreviation,
          companyAddress: this.ruleForm.companyAddress,
          purposesOfGasUse: this.ruleForm.purposesOfGasUse,
          businessScope: this.ruleForm.businessScope,
          meters: this.ruleForm.meters,
          placesOfGasNeeded: this.ruleForm.placesOfGasNeeded,
          companyContacts: this.ruleForm.companyContacts,
          id: this.id,
          userId: this.userId
        }
        axios.put('/companies', editData).then((response) => {
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
      }
    },
    // 点击行响应
    handleclick: function(row, event, column) {
      this.highlightId = row.id
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 多选响应
    handleSelectionChange: function(val) {
      this.multipleSelection = val
    },
    // 改变当前点击的行的class，高亮当前行
    tableRowClassName: function(row, index) {
      if (row.row.id === this.highlightId) {
        return 'info-row'
      }
    },
    // 按照企业名称搜索
    search: function() {
      if (this.name === '') {
        this.loadData(this.currentPage, this.pagesize)
      } else {
        var url = '/companies/name/' + this.name
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
    },
    // 重置
    resetForm() {
      this.name = ''
    },
    // 删除
    handleDelete: function(index, row) {
      this.$confirm('确定删除企业信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var url = '/companies/' + row.id
        axios.delete(url).then((response) => {
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
    // 多项删除
    deletenames: function() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请至少选择一项企业信息',
          type: 'info'
        })
      } else {
        this.multipleSelection.forEach((item) => {
          var url = '/companies/' + item.id
          axios.delete(url).then((response) => {
            if (response.data.msg === 'success') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loadData(this.currentPage, this.pagesize)
            }
          })
        })
      }
    }
  }
}
</script>
<style>
@import '../../styles/common.css';
  .el-table .info-row {
      background: #c9e5f5;
  } 
  .del {
   float: right;
   margin-right:-60px;
   margin-top:-32px;
  }
   .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>


