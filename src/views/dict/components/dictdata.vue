<template>
  <div>
    <!-- 字典数据管理 -->
    <el-row>
      <div style="margin-top:5px;">
        <el-row>
          <el-col :span="12">
            <span style="padding-left:5px;line-height:32px;cursor:pointer;" @click="todict">
              <i class="el-icon-d-arrow-left"></i>
              {{`字典数据 (${dict.name})`}}
            </span>
          </el-col>
          <el-col style="text-align:right;padding-right:5px;" :span="12">
            <el-button type="primary" size="small" @click="showsearchbar=!showsearchbar">{{showsearchbar?'隐藏':'查询'}}</el-button>
            <el-button type="primary" size="small" @click="adddict">新增</el-button>
            <el-button size="small" @click="deletedict">删除</el-button>
          </el-col>
        </el-row>
        <hr class="fengeline">
        <el-row style="margin-left:5px;" v-show="showsearchbar">
          <span>字典标签: </span>
          <el-input v-model="sdictform.label" style="width:200px;"></el-input>
          <span>字典键值: </span>
          <el-input v-model="sdictform.value" style="width:200px;"></el-input>
          <el-button type="primary" size="small" @click="searchdict">查询</el-button>
        </el-row>
      </div>
      <div>
        <dynamictable :columns="columns" :tabledata="tabledata" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick"></dynamictable>
      </div>
    </el-row>
    <el-dialog title="新增字典数据" :visible.sync="dictinfovisible" @close="dialogclose">
      <div>
        <el-form ref="dictform" :model="dictform" label-width="80px" label-position="left">
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="dictform.label"></el-input>
          </el-form-item>
          <el-form-item label="字典键值" prop="value">
            <el-input v-model="dictform.value"></el-input>
          </el-form-item>
          <el-form-item label="字典描述" prop="memo">
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
import { getdictdatalist, adddictdata, updatedictdata, deletedictdata } from '@/api/dict'
export default {
  props: {
    dict: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    dynamictable
  },
  data() {
    return {
      showsearchbar: false,
      columns: [
        {
          showname: '字典标签',
          dataindex: 'label'
        },
        {
          showname: '字典键值',
          dataindex: 'value'
        },
        {
          showname: '排序号',
          dataindex: 'number'
        },
        {
          showname: '系统内置',
          dataindex: 'issystem'
        },
        {
          showname: '更新时间',
          dataindex: 'updatetime'
        },
        {
          showname: '备注',
          dataindex: 'memo'
        },
        {
          showname: '状态',
          dataindex: 'status'
        }
      ],
      tabledata: [],
      dictinfovisible: false,
      isnew: false,
      dictform: {
        label: '',
        value: '',
        memo: ''
      },
      sdictform: {
        label: '',
        value: ''
      },
      delarray: []
    }
  },
  methods: {
    resetdata() {
      this.dictform = {
        label: '',
        value: '',
        memo: ''
      }
    },
    rowclick(row, event, column) {
      this.isnew = false
      switch (column.label) {
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
      getdictdatalist({
        dictId: this.dict.id
      }).then(response => {
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
      this.$confirm('此操作将永久删除改数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletedictdata(this.delarray).then(response => {
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
          adddictdata({ ...this.dictform, dictId: this.dict.id }).then(response => {
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
          updatedictdata({ ...this.dictform, dictId: this.dict.id }).then(response => {
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
      getdictdatalist({
        dictId: this.dict.id,
        label: this.sdictform.label.trim(),
        value: this.sdictform.value.trim()
      }).then(response => {
        if (response.data.msg === 'success') {
          this.tabledata = response.data.data.rows
        }
      })
    },
    todict() {
      this.$emit('todict')
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
</style>


