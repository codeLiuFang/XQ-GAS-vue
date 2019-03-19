<template>
<div class="pbody">
    <el-row :gutter="20">
         <el-form ref="form"  label-width="80px">
  <el-col :span="6"> <el-form-item label="气源类型">
    <el-select v-model="sourcesTypeid"  placeholder="请选择类型" >
        <el-option
      v-for="item in sourcesType"
      :key="item.sourcesTypeid"
      :label="item.label"
      :value="item.sourcesTypeid">
    </el-option>
    </el-select>
  </el-form-item></el-col>
  <el-col :span="6"> <el-form-item label="价格单位">
    <el-select v-model="unitid" placeholder="请选择单位" >
       <el-option
      v-for="item in unit"
      :key="item.unitid"
      :label="item.label"
      :value="item.unitid">
    </el-option>
    </el-select>
  </el-form-item></el-col>
  <el-col :span="6"> <el-form-item label="气源名称" >
    <el-input v-model="sourceName"></el-input>
  </el-form-item></el-col>
  <el-col :span="6"><el-form-item>
    <el-button type="primary" @click="saveSourceInfo" >立即创建</el-button>
  </el-form-item></el-col>
  </el-form>
</el-row>
      <el-table
            ref='testTable'       
            :data="tableData"
           class="gtable"
            :header-cell-style="{
            'background-color': '#f6f6f6',
             }"   
            border
            :default-sort = "{prop: 'sourceName', order: 'ascending'}"
            >
            <el-table-column
              prop="sourceType.label"
              label="气源类型"
      
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="sourceName"           
              label="气源名称"
              sortable>
            </el-table-column>
            <el-table-column
              prop="unit.label"
              label="单位"
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
          <!-- 编辑start -->
            <el-dialog  :visible.sync="dialogFormVisible">
              <el-form :model="form" label-width="100px" class="demo-ruleForm">
              <el-form-item label="气源名称" >
                <el-input v-model="form.selectsourceName"></el-input>
              </el-form-item>
              <el-form-item label="气源类型" >
                  <el-select v-model="form.selectsourcesTypeid"  placeholder="请选择类型">
                      <el-option
                    v-for="item in sourcesType"
                    :key="item.sourcesTypeid"
                    :label="item.label"
                    :value="item.sourcesTypeid">
                  </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="价格单位" >
                 <el-select v-model="form.selectunitid" placeholder="请选择单位">
                        <el-option
                        v-for="item in unit"
                        :key="item.unitid"
                        :label="item.label"
                        :value="item.unitid">
                      </el-option>
                      </el-select>
              </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveGasSource">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 编辑end -->
          <el-pagination class="pstyle"
                  :current-page="currentPage"
                  :page-sizes='[10, 20, 30, 40]'
                  :page-size="pagesize"
                  layout='total, sizes, prev, pager, next, jumper'
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
      // 多选数组
      multipleSelection: [],
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
      // 添加数据
      sourcesType: [
        {
          sourcesTypeid: '',
          label: ''
        }
      ],
      unit: [
        {
          unitid: '',
          label: ''
        }
      ],
      sourcesTypeid: '',
      unitid: '',
      sourceName: '',
      // 编辑窗体  数据
      form: {
        id: '',
        selectsourceName: '',
        selectsourcesTypeid: '',
        selectunitid: ''
      }
    }
  },
  created: function() {
    this.loadData(this.currentPage, this.pagesize)
    this.getSourceTypeSelect()
    this.getUintSelect()
  },
  methods: {
    loadData: function(pageNumber, pageSize) {
      axios.get('/gas/sources', {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize
        }
      }).then(response => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
        if (response.data.msg === 'success') {
          var data = response.data.data.rows
          this.tableData = data
          this.totalCount = response.data.data.total
        }
      })
    },
    // 气源类型select
    getSourceTypeSelect: function() {
      axios.get('/gas/sources/types').then(response => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
        if (response.data.msg === 'success') {
          var data = response.data.data
          var sourcesData = []
          for (let i = 0; i < data.length; i++) {
            sourcesData.push({
              sourcesTypeid: data[i].id,
              label: data[i].label
            })
          }
          this.sourcesType = sourcesData
        }
      })
    },
    // 价格单位select
    getUintSelect: function() {
      axios.get('/gas/sources/units').then(response => {
        // console.log(JSON.parse(JSON.stringify(response.data.data.rows)))
        if (response.data.msg === 'success') {
          var data = response.data.data
          var unitData = []
          for (let i = 0; i < data.length; i++) {
            unitData.push({
              unitid: data[i].id,
              label: data[i].label
            })
          }
          this.unit = unitData
        }
      })
    },
    // changeSourcesType(val) {
    //   this.sourcesTypeid = val
    // },
    // changeUnit(val) {
    //   this.unitid = val
    // },
    // 保存气源信息  新增
    saveSourceInfo: function() {
      var sourceData = {
        sourceName: this.sourceName,
        sourceType: this.sourcesTypeid,
        unit: this.unitid
      }
      console.log(sourceData)
      axios.post('/gas/sources', sourceData).then(response => {
        if (response.data.msg === 'success') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.sourceName = ''
          this.sourcesTypeid = ''
          this.unitid = ''
          this.loadData(this.currentPage, this.pagesize)
        } else {
          this.$message({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除
    handleDelete: function(index, row) {
      this.$confirm('确定删除气源信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var url = '/gas/sources/' + row.id
          axios.delete(url).then(response => {
            if (response.data.msg === 'success') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loadData(this.currentPage, this.pagesize)
            } else {
              this.$message({
                message: response.data.msg,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑气源
    handleEdit: function(index, row) {
      this.dialogFormVisible = true
      this.form.selectsourceName = row.sourceName
      this.form.selectsourcesTypeid = row.sourceType.id
      this.form.selectunitid = row.unit.id
      this.form.id = row.id
    },
    // 保存气源  编辑
    saveGasSource: function() {
      var editGas = {
        id: this.form.id,
        sourceName: this.form.selectsourceName,
        sourceType: this.form.selectsourcesTypeid,
        unit: this.form.selectunitid
      }
      console.log(editGas)
      axios.put('/gas/sources', editGas).then((response) => {
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
    }
  }
}
</script>
<style>
@import '../../styles/common.css';
</style>
