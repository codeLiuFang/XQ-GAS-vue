<template>
   <div>
     <el-row :gutter="20">
  <el-col :span="8">
     <el-checkbox-group v-model="checkList">
    <el-checkbox label="生产"></el-checkbox>
    <el-checkbox label="生活"></el-checkbox>
    <el-checkbox label="采暖"></el-checkbox>
     </el-checkbox-group>
     </el-col>
  <el-col :span="8"> <el-input placeholder="请输入内容" v-model="criteria" style="padding-bottom:10px;">
          </el-input></el-col>
  <el-col :span="4"><el-button type="primary">搜索</el-button>
  <el-button type="success">重置</el-button></el-col>
  <el-col :span="4"><el-button type="primary" @click="dialogFormVisible = true" >添加</el-button>
  <el-button type="success">删除</el-button></el-col>

  <el-dialog title="新增企业信息" :visible.sync="dialogFormVisible">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
   <el-form-item label="企业名称" prop="companyName">
    <el-input v-model="ruleForm.companyName"></el-input>
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
  <el-form-item v-for="(companyContact, index) in ruleForm.companyContact" 
       :label="'联系人' + index"
       :key="companyContact.key">
      <el-input v-model="companyContact.contactName"></el-input>
    </el-form-item>
    <el-form-item 
       v-for="(companyContact, index) in ruleForm.companyContact" 
       :label="'联系方式' + index"
       :key="companyContact.key">
      <el-input v-model="companyContact.contactNumber"></el-input><el-button @click.prevent="removeCompany(companyContact)">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addContracts">新增联系方式</el-button>
    </el-form-item>
    <el-form-item label="用气地点" prop="placeOfGasNeeded">
    <el-input v-model="ruleForm.placeOfGasNeeded"></el-input>
  </el-form-item>
  <el-form-item label="用气性质">
    <el-checkbox-group v-model="ruleForm.purposeOfGasUse">
      <el-checkbox label="采暖"></el-checkbox>
      <el-checkbox label="生产"></el-checkbox>
      <el-checkbox label="生活"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="日高峰用气量" prop="dailyPeekOfGasConsumption">
    <el-input v-model="ruleForm.dailyPeekOfGasConsumption">m³</el-input>
  </el-form-item>
   <el-form-item label="经营范围" prop="ruleForm.businessScope">
    <el-input v-model="ruleForm.businessScope">m³</el-input>
  </el-form-item>
 
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCompany">确 定</el-button>
  </div>
</el-dialog>

</el-row>
     
       
      <el-table
            ref="testTable"       
            :data="tableData"
            style="width:100%"
            border
            :default-sort = "{prop: 'id', order: 'ascending'}"
            @selection-change="handleSelectionChange"   
            @row-click="handleclick"
            :row-class-name = "tableRowClassName"
            >
            <el-table-column
              type="selection"
              >
            </el-table-column>
            <el-table-column
              prop="id"
              label="企业名称"
      
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="name"
              label="联系人"
              sortable>
            </el-table-column>
            <el-table-column
              prop="name"
              label="用气性质"
              sortable>
            </el-table-column>
            <el-table-column
              prop="name"
              label="日高峰用气量（m³）"
              sortable>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
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
      tableData3: [],
      // 多选数组
      multipleSelection: [],

      // 请求的URL
      // url:'newstu/querystudentbypage',

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
      dialogFormVisible: false,
      formLabelWidth: '120px',
      ruleForm: {
        loginId: '',
        password: '',
        companyName: '',
        companyAddress: '',
        purposeOfGasUse: [],
        dailyPeekOfGasConsumption: '',
        businessScope: '',
        placeOfGasNeeded: '',
        companyContact: [{
          contactName: '',
          contactNumber: ''
        }]
      }
    }
  },
  created: function() {
    this.loadData()
  },
  methods: {
    // 从服务器读取数据
    loadData: function(pageNumber, pageSize) {
      axios.get('/companies').then((response) => {
        console.log(response.data)           
      })
    },
    addContracts() {
      this.ruleForm.companyContact.push({
        contactName: '',
        contactNumber: ''
      })
    },
    removeCompany(item) {
      var index = this.ruleForm.companyContact.indexOf(item)
      console.log(index)
      if (index !== -1) {
        this.ruleForm.companyContact.splice(index, 2)
      }
    },
    addCompany: function() {
      var pwd = Base64.encode(this.ruleForm.password)
      // this.ruleForm.password = pwd
      // console.log(JSON.stringify(this.ruleForm))

      var jsonData = {
        loginId: this.ruleForm.loginId,
        password: pwd,
        companyName: this.ruleForm.companyName,
        companyAddress: this.ruleForm.companyAddress,
        purposeOfGasUse: this.ruleForm.purposeOfGasUse,
        dailyPeekOfGasConsumption: this.ruleForm.dailyPeekOfGasConsumption,
        businessScope: this.ruleForm.businessScope,
        placeOfGasNeeded: this.ruleForm.placeOfGasNeeded,
        companyContact: this.ruleForm.companyContact
      }
      console.log(jsonData)
      // var jsonData = JSON.stringify(this.ruleForm)
      /*  axios.post('/companies', JSON.parse(jsonData)).then((response) => {
        console.log(response)
      }) */
    }       
  }
}
</script>

