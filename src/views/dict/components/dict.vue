<template>
  <div>
    <!-- 字典管理 -->
    <el-row>
      <div style="margin-top:5px;">
        <el-row>
          <el-col :span="12">
            <span style="padding-left:5px;line-height:32px;">字典列表</span>
          </el-col>
          <el-col style="text-align:right;padding-right:5px;" :span="12">
            <el-button type="primary" size="small" @click="showsearchbar=!showsearchbar">{{showsearchbar?'隐藏':'查询'}}</el-button>
            <el-button type="primary" size="small" @click="adddict">新增</el-button>
            <el-button size="small" @click="deletedict">删除</el-button>
          </el-col>
        </el-row>
        <hr class="fengeline">
        <el-row style="margin-left:5px;" v-show="showsearchbar">
          <span>字典名称: </span>
          <el-input v-model="sdictform.name" style="width:200px;"></el-input>
          <el-button type="primary" size="small" @click="searchdict">查询</el-button>
        </el-row>
      </div>
      <div>
        <dynamictable class="dicttable" :columns="columns" :tabledata="tabledata" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick" @eventbus="eventbus"></dynamictable>
      </div>
    </el-row>
    <el-dialog title="新增字典" :visible.sync="dictinfovisible" @close="dialogclose">
      <div>
        <el-form ref="dictform" :model="dictform" label-width="80px" label-position="left">
          <el-form-item label="字典名称" prop="name">
            <el-input v-model="dictform.name"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="dictform.memo"></el-input>
          </el-form-item>
          <el-form-item label="创建人" v-if="!isnew">
            {{dictform.createUser}}
          </el-form-item>
          <el-form-item label="更新时间" v-if="!isnew">
            {{dictform.updatetime}}
          </el-form-item>
        </el-form>
        <div style="text-align:center;">
          <el-button type="primary" size="small" @click="savedict">{{isnew?'保存':'更新'}}</el-button>
          <el-button size="small" @click="dictinfovisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dynamictable from '@/components/gtptable/dynamictable'
import { adddict, getdictlist, deletedict, updatedict } from '@/api/dict'
export default {
  components: {
    dynamictable
  },
  data() {
    return {
      showsearchbar: false,
      columns: [
        {
          showname: '字典名称',
          dataindex: 'name'
        },
        {
          showname: '字典类型',
          dataindex: 'memo'
        },
        {
          showname: '系统字典',
          dataindex: 'memo'
        },
        {
          showname: '更新时间',
          dataindex: 'updatetime'
        },
        {
          showname: '状态',
          dataindex: 'status'
        },
        {
          showname: '备注',
          dataindex: 'memo'
        },
        {
          showname: '操作',
          dataindex: 'memo',
          type: 'elbuttongroup'
        }
      ],
      tabledata: [],
      dictinfovisible: false,
      isnew: false,
      dictform: {
        name: '',
        memo: ''
      },
      sdictform: {
        name: ''
      },
      delarray: []
    }
  },
  methods: {
    eventbus(dispatchid) {
      console.log(arguments)
      switch (dispatchid) {
        case 'success':
          this.$message('do success option')
          break
        case 'info':
          this.$message('do info option')
          break
        case 'warning':
          this.$message('do warning option')
          break
      }
    },
    resetdata() {
      this.dictform = {
        name: '',
        memo: ''
      }
    },
    rowclick(row, event, column) {
      this.isnew = false
      switch (column.label) {
        case '字典类型':
          this.$emit('todictdata', row)
          break
        default:
          this.dictform = { ...row }
          this.dictinfovisible = true
          break
      }
    },
    selectionchange(data) {
      this.delarray = data.map(item => {
        return item.id
      })
    },
    refreshdict() {
      getdictlist().then(response => {
        if (response.data.msg === 'success') {
          this.tabledata = response.data.data.rows
        }
      })
    },
    adddict() {
      this.isnew = true
      this.dictinfovisible = true
    },
    deletedict() {
      if (this.delarray.length === 0) return
      this.$confirm('此操作将永久删除字典,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletedict(this.delarray).then(response => {
          if (response.data.msg === 'success') {
            this.$message('删除成功')
            this.refreshdict()
          } else {
            this.$message('删除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    savedict() {
      switch (this.isnew) {
        case true: // 新增
          adddict(this.dictform).then(response => {
            if (response.data.msg === 'success') {
              this.$message('保存成功')
              this.dictinfovisible = false
              this.refreshdict()
            } else {
              this.$message('保存失败')
            }
          })
          break
        case false: // 更新
          updatedict(this.dictform).then(response => {
            if (response.data.msg === 'success') {
              this.$message('更新成功')
              this.refreshdict()
              this.dictinfovisible = false
            } else {
              this.$message('更新失败')
            }
          })
          break
      }
    },
    searchdict() {
      getdictlist({
        name: this.sdictform.name.trim()
      }).then(response => {
        if (response.data.msg === 'success') {
          this.tabledata = response.data.data.rows
        }
      })
    },
    dialogclose() {
      this.$refs['dictform'].resetFields()
      this.resetdata()
    }
  },
  created() {
    this.refreshdict()
  }
}
</script>
<style>
.dicttable table tr td:nth-child(3) {
  cursor: pointer;
  color: #3c8dbc;
}
</style>


