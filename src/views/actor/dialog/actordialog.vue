<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogvisible" @close="close" class="actordialog">
      <div>
        <el-row>
          <div>
            <el-row>
              <el-col :span="12">
                <span style="padding-left:5px;line-height:32px;">角色列表</span>
              </el-col>
              <el-col style="text-align:right;padding-right:5px;" :span="12">
                <el-button type="primary" size="small" @click="showsearchbar=!showsearchbar">{{showsearchbar?'隐藏':'查询'}}</el-button>
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
            <dynamictable :columns="columns" ref="actortable" :tabledata="tabledata" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick" :pagesizes="[8]" :layout="'total, sizes, prev, pager, next'"></dynamictable>
          </div>
        </el-row>
      </div>
      <div style="text-align:center;padding-bottom:5px;">
        <el-button size="mini" type="primary" @click="ok">保存</el-button>
        <el-button size="mini" @click="dialogvisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dynamictable from '@/components/gtptable/dynamictable'
import { getactorlist } from '@/api/actor'
export default {
  components: {
    dynamictable
  },
  watch: {
    visible(newvalue, oldvalue) {
      this.dialogvisible = newvalue
    }
  },
  props: {
    title: {
      type: String,
      default: '分配角色'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogvisible: false,
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
          showname: '系统角色',
          dataindex: ''
        },
        {
          showname: '状态',
          dataindex: 'status'
        }
      ],
      tabledata: [],
      actorsid: [],
      forminfovisible: false,
      isnew: false,
      dataform: {
        name: '',
        memo: ''
      },
      sdataform: {
        name: ''
      }
    }
  },
  methods: {
    ok() {
      this.$emit('ok', this.actorsid)
      this.$refs['actortable'].clearSelection()
      this.dialogvisible = false
    },
    close() {
      this.$refs['actortable'].clearSelection()
      this.$emit('close')
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
      this.actorsid = data.map(item => {
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
    searchdata() {
      getactorlist({
        name: this.sdataform.name.trim()
      }).then(response => {
        if (response.data.msg === 'success') {
          this.tabledata = response.data.data.rows
        }
      })
    }
  },
  created() {
    this.refreshtable()
  }
}
</script>
<style>
.actordialog .el-dialog__body {
  padding: 0px 20px;
}
</style>

