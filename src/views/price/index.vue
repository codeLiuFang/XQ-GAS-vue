<template>
<div class="pbody">
    <el-row>
         <el-form ref="form" :model="form" label-width="80px">
  <el-col :md="3" :lg="4" ><el-form-item label="日期">
    <div class="block">
    <el-date-picker
      v-model="form.date"
      type="date"
      placeholder="选择日期"  value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
  </el-form-item></el-col>
  <el-col :md="3" :lg="4" ><el-form-item label="气源名称">
    <el-select v-model="sourcesTypeid" placeholder="请选择气源名称">
      <el-option 
      v-for = "item in form.sourcesType"
      :key = "item.sourcesTypeid"
      :label = "item.label"
      :value = "item.sourcesTypeid">
      </el-option>
    </el-select>
  </el-form-item></el-col>
  <el-col :md="4" :lg="3" ><el-form-item label="价格">
    <el-input v-model="form.price"></el-input>
  </el-form-item></el-col>
  <el-col :md="2" :lg="4" ><el-form-item>
    <el-button type="primary" style="display: inline-block" @click="savePriceInfo">录入</el-button>
  </el-form-item></el-col> 
  <el-col :md="4" :lg="5" > <div class="block">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']" 
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </div></el-col>
  <el-col :md="2" :lg="3" ><el-button type="primary" v-on:click="searchByDate">查询</el-button>
   </el-col>
  </el-form>
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
              prop="date"
              label="日期"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="sourceType"
              label="气源类型"
              sortable>
            </el-table-column>
            <el-table-column
              prop="sourceName"
              label="气源名称"
              sortable>
            </el-table-column>
            <el-table-column
              prop="unitprice"
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
           <!-- 修改start -->
            <el-dialog  :visible.sync="dialogFormVisible">
              <el-form :model="form1" label-width="100px" class="demo-ruleForm">
              <el-form-item label="日期" >
                <div class="block">
                  <el-date-picker
                    v-model="form1.date"
                    type="date"
                    placeholder="选择日期"  value-format="yyyy-MM-dd" readonly>
                  </el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="气源名称" >
                  <el-input v-model="form1.sourceName" readonly></el-input>
              </el-form-item>
              <el-form-item label="价格单位" >
                <el-input v-model="form1.price"></el-input>
              </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePriceSource">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 修改end -->
          <el-pagination class="pstyle"
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
        // 搜索条件
        name: '',
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
        // 搜索
        dateRange: '',
        form: {
          date: '',
          sourcesType: [
            {
              sourcesTypeid: '',
              label: ''
            }
          ],
          price: ''
          // sourcesTypeid: ''
        },
        sourcesTypeid: '',
        // 修改窗体数据
        form1: {
          id: '',
          date: '',
          sourceName: '',
          price: ''
        },
        gasSourceId: ''
      }
    },
    created: function() {
      this.loadData(this.currentPage, this.pagesize)
      this.getGasSourceName()
    },
    methods: {
      loadData: function(pageNumber, pageSize) {
        axios.get('/gas/prices', {
          params: {
            pageNumber: pageNumber,
            pageSize: pageSize
          }
        })
          .then(response => {
            if (response.data.msg === 'success') {
              var data = response.data.data.rows
              this.formateTabelData(data)
              this.totalCount = response.data.data.total
            }
          })
      },
      // 修改
      handleEdit: function(index, row) {
        console.log(row)
        this.dialogFormVisible = true
        this.form1.date = row.date
        this.form1.sourceName = row.sourceName
        this.form1.price = row.price
        this.form1.id = row.id
        this.sourcesTypeid = row.gasSourceId
      },
      // 删除
      handleDelete: function(index, row) {
        this.$confirm('确定删除该条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var url = '/gas/prices/' + row.id
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 查询所有气源名称
      getGasSourceName: function() {
        axios.get('/gas/sources').then(response => {
          var sourceRows = (JSON.parse(JSON.stringify(response.data.data.rows)))
          if (response.data.msg === 'success') {
            // var sourceName = sourceRows.sourceName
            var sourcesName = []
            for (let i = 0; i < sourceRows.length; i++) {
              sourcesName.push({
                sourcesTypeid: sourceRows[i].id,
                label: sourceRows[i].sourceName
              })
            }
            // console.log(sourcesName)
            this.form.sourcesType = sourcesName
            // console.log(this.form.sourcesType)
          }
        })
      },
      // 保存价格信息 新增
      savePriceInfo: function() {
        var priceData = {
          date: this.form.date,
          gasSourceId: this.sourcesTypeid,
          price: this.form.price
        }
        console.log(priceData)
        axios.post('/gas/prices', priceData).then(response => {
          if (response.data.msg === 'success') {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.form.date = ''
            this.sourcesTypeid = ''
            this.form.price = ''
            this.loadData(this.currentPage, this.pagesize)
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      },
      // 编辑保存
      savePriceSource: function() {
        var editPrice = {
          id: this.form1.id,
          date: this.form1.date,
          sourceName: this.form1.sourceName,
          price: this.form1.price,
          gasSourceId: this.sourcesTypeid
        }
        console.log(editPrice)
        axios.put('/gas/prices', editPrice).then((response) => {
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
      },
      // 按时间区间搜索价格
      searchByDate: function() {
        if (this.dateRange === '') {
          this.$message({
            showClose: true,
            message: '请选择日期',
            type: 'warning'
          })
        } else {
          var dateRange = this.dateRange
          var url = '/gas/prices/' + dateRange[0] + '~' + dateRange[1]
          axios.get(url, {
            params: {
              pageNumber: this.pageNumber,
              pageSize: this.pageSize
            }
          }).then((response) => {
            if (response.data.msg === 'success') {
              var data = response.data.data.rows
              this.formateTabelData(data)
              this.totalCount = response.data.data.total
            }
          })
        }
      },
      // 格式化整理构造表格数据
      formateTabelData: function(data) {
        for (let i = 0; i < data.length; i++) {
          data[i]['sourceName'] = ''
          data[i]['sourceType'] = ''
          data[i]['unitprice'] = ''
          var url = '/gas/sources/' + data[i].gasSourceId
          axios.get(url).then((response) => {
            if (response.data.msg === 'success') {
              data[i]['sourceName'] = response.data.data.sourceName
              data[i]['sourceType'] = response.data.data.sourceType.label
              data[i]['unitprice'] = data[i].price + '' + response.data.data.unit.label
            }
          })
        }
        this.tableData = data
      }
    }
  }
</script>
<style>
@import '../../styles/common.css';
</style>
