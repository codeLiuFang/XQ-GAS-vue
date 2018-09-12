<template>
<div>
    <el-row :gutter="20">
         <el-form ref="form" :model="form" label-width="80px">
  <el-col :span="4"><el-form-item label="日期">
    <el-input v-model="form.name"></el-input>
  </el-form-item></el-col>
  <el-col :span="4"><el-form-item label="气源类型">
    <el-select v-model="form.region" placeholder="请选择气源类型">
      <el-option label="元/吨" value="lang"></el-option>
      <el-option label="元/方" value="guan"></el-option>
    </el-select>
  </el-form-item></el-col>
  <el-col :span="5"><el-form-item label="气源名称">
    <el-select v-model="form.region" placeholder="请选择气源名称">
      <el-option label="元/吨" value="lang"></el-option>
      <el-option label="元/方" value="guan"></el-option>
    </el-select>
  </el-form-item></el-col>
  <el-col :span="5"><el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item></el-col>
  </el-form>
</el-row>
      <el-table
            ref="testTable"       
            :data="tableData"
            style="width:100%"
            border
            :default-sort = "{prop: 'companyName', order: 'ascending'}"
             @selection-change="handleSelectionChange"
             @row-click="handleclick"
            :row-class-name = "tableRowClassName"
            >
            <el-table-column
              prop="companyName"
              label="日期"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="companyContacts"
              :formatter="formaterContracts"
              label="气源类型"
              sortable>
            </el-table-column>
            <el-table-column
              prop="purposesOfGasUse"
              label="气源名称"
              sortable>
            </el-table-column>
            <el-table-column
              prop="purposesOfGasUse"
              label="价格"
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
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!')
      }
    }
  }
</script>