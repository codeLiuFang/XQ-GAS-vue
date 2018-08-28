<template>
  <div>
    <!-- 角色管理 -->
    <el-row>
      <div style="margin-top:5px;">
        <el-row>
          <el-col :span="12">
            <span style="padding-left:5px;line-height:32px;">角色列表</span>
          </el-col>
          <el-col style="text-align:right;padding-right:5px;" :span="12">
            <el-button type="primary" size="small" @click="showsearchbar=!showsearchbar">{{showsearchbar?'隐藏':'查询'}}</el-button>
            <el-button type="primary" size="small" @click="adddata">新增</el-button>
            <el-button size="small" @click="deletedata">删除</el-button>
          </el-col>
        </el-row>
        <hr class="fengeline">
        <el-row style="margin-left:5px;" v-show="showsearchbar">
          <span>角色名称: </span>
          <el-input v-model="sdataform.name" style="width:200px;"></el-input>
          <el-button type="primary" size="small" @click="searchdata">查询</el-button>
        </el-row>
      </div>
      <div>
        <dynamictable :columns="columns" :tabledata="tabledata" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick" @eventbus="eventbus"></dynamictable>
      </div>
    </el-row>
    <el-dialog title="新增角色" :visible.sync="forminfovisible" @close="dialogclose">
      <div>
        <el-form ref="dataform" :model="dataform" label-width="80px" label-position="left">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="dataform.name"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="dataform.code"></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="number">
            <el-input v-model="dataform.number"></el-input>
          </el-form-item>
          <el-form-item label="系统内置" prop="system">
            <el-input v-model="dataform.system"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="dataform.memo"></el-input>
          </el-form-item>
          <el-form-item label="创建人" v-if="!isnew">
            {{dataform.createUser}}
          </el-form-item>
          <el-form-item label="更新时间" v-if="!isnew">
            {{dataform.updatetime}}
          </el-form-item>
        </el-form>
        <div style="text-align:center;">
          <el-button type="primary" size="small" @click="savedata">{{isnew?'保存':'更新'}}</el-button>
          <el-button size="small" @click="forminfovisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dynamictable from '@/components/gtptable/dynamictable'
import { getactorlist, addactor, updateactor, deleteactor, getusersbyactorid } from '@/api/actor'
export default {
  components: {
    dynamictable
  },
  data() {
    return {
      showsearchbar: false,
      columns: [
        {
          showname: '角色名称',
          dataindex: 'name'
        },
        {
          showname: '角色编码',
          dataindex: ''
        },
        {
          showname: '排序号',
          dataindex: ''
        },
        {
          showname: '系统角色',
          dataindex: ''
        },
        {
          showname: '更新时间',
          dataindex: 'updatetime'
        },
        {
          showname: '备注信息',
          dataindex: 'memo'
        },
        {
          showname: '状态',
          dataindex: 'status'
        },
        {
          showname: '操作',
          type: 'elbuttongroup',
          width: '135px',
          groups: [
            {
              type: 'success',
              id: 'adduser',
              classnamelist: 'fa fa-user-plus',
              title: '分配用户'
            }
          ]
        }
      ],
      tabledata: [],
      forminfovisible: false,
      isnew: false,
      dataform: {
        name: '',
        memo: ''
      },
      sdataform: {
        name: ''
      },
      delarray: []
    }
  },
  methods: {
    eventbus(dispatchid, event, columnscope, columndefine) {
      // console.log(...arguments)
      switch (dispatchid) {
        case 'adduser':
          getusersbyactorid(columnscope.row.id).then(response => {
            if (response.data.msg === 'success') {
              this.$emit('toactoruser', { tabledata: response.data.data, row: columnscope.row })
            }
          })
          break
        case 'warning':
          break
      }
    },
    resetdata() {
      this.dataform = {
        name: '',
        memo: ''
      }
    },
    rowclick(row, event, column) {
      this.isnew = false
      switch (column.label) {
        case '角色类型':
          this.$emit('todictdata', row)
          break
        default:
          this.dataform = { ...row }
          this.forminfovisible = true
          break
      }
    },
    selectionchange(data) {
      this.delarray = data.map(item => {
        return item.id
      })
    },
    refreshtable() {
      getactorlist().then(response => {
        if (response.data.msg === 'success') {
          this.tabledata = response.data.data.rows
        }
      })
    },
    adddata() {
      this.isnew = true
      this.forminfovisible = true
    },
    deletedata() {
      if (this.delarray.length === 0) return
      this.$confirm('此操作将永久删除角色,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteactor(this.delarray).then(response => {
          if (response.data.msg === 'success') {
            this.$message('删除成功')
            this.refreshtable()
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
    savedata() {
      switch (this.isnew) {
        case true: // 新增
          addactor(this.dataform).then(response => {
            if (response.data.msg === 'success') {
              this.$message('保存成功')
              this.forminfovisible = false
              this.refreshtable()
            } else {
              this.$message('保存失败')
            }
          })
          break
        case false: // 更新
          updateactor(this.dataform).then(response => {
            if (response.data.msg === 'success') {
              this.$message('更新成功')
              this.refreshtable()
              this.forminfovisible = false
            } else {
              this.$message('更新失败')
            }
          })
          break
      }
    },
    searchdata() {
      getactorlist({
        name: this.sdataform.name.trim()
      }).then(response => {
        if (response.data.msg === 'success') {
          this.tabledata = response.data.data.rows
        }
      })
    },
    dialogclose() {
      this.$refs['dataform'].resetFields()
      this.resetdata()
    }
  },
  created() {
    this.refreshtable()
  }
}
</script>
<style>
/* .dicttable table tr td:nth-child(3) {
  cursor: pointer;
  color: #3c8dbc;
} */
</style>


