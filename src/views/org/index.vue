<template>
  <div>
    <el-row>
      <el-col :span="4" class="leftside">
        <orgtree @nodeclick="nodeclick" ref="orgtree" @loaded="loaded"></orgtree>
      </el-col>
      <el-col :span="20" class="rightside">
        <el-row style="margin-top:5px;">
          <!-- <el-col :span="20" style="padding-left:5px;">
            <el-select placeholder="请选择" style="width:150px;" v-model="searchkey">
              <el-option v-for="item in orgoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input style="width:200px;"></el-input>
            <el-button type="primary" size="small">搜索</el-button>
          </el-col> -->
          <el-col :span="24" style="text-align:right;padding-right:5px;">
            <el-button type="primary" size="small" @click="addorg">新增</el-button>
            <el-button size="small" @click="deleteorg">删除</el-button>
          </el-col>
        </el-row>
        <dynamictable :tabledata="tabledata" :columns="columns" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick"></dynamictable>
      </el-col>
    </el-row>
    <!-- 弹出框 组织机构详情-->
    <el-dialog title="组织详情" :visible.sync="orginfovisible" @close="dialogclose">
      <div>
        <el-form ref="orgform" :model="orgform" label-width="80px" label-position="left">
          <el-form-item label="组织名称" prop="deptName">
            <el-input v-model="orgform.deptName"></el-input>
          </el-form-item>
          <el-form-item label="组织编号" prop="deptCode">
            <el-input v-model="orgform.deptCode"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="orgform.remark"></el-input>
          </el-form-item>
          <el-form-item label="创建人" v-if="!isnew">
            {{orgform.createUser}}
          </el-form-item>
          <el-form-item label="创建时间" v-if="!isnew">
            {{orgform.createDateFm}}
          </el-form-item>
        </el-form>
        <div style="text-align:center;">
          <el-button type="primary" size="small" @click="saveorg">{{isnew?'保存':'更新'}}</el-button>
          <el-button size="small" @click="orginfovisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchorglazy, deleteorgbyid, updateorgbyid, saveorgbypid } from '@/api/org'
import dynamictable from '@/components/gtptable/dynamictable'
import orgtree from '@/views/org/components/orgtree'
export default {
  components: {
    dynamictable,
    orgtree
  },
  data() {
    return {
      curnodedata: {},
      tabledata: [],
      columns: [
        {
          showname: '组织名称',
          dataindex: 'deptName'
        },
        {
          showname: '组织编号',
          dataindex: 'deptCode'
        },
        {
          showname: '创建人',
          dataindex: 'createUser'
        },
        {
          showname: '创建日期',
          dataindex: 'createDateFm'
        }
      ],
      orgoptions: [
        {
          value: 'org',
          label: '组织名称'
        },
        {
          value: 'orgno',
          label: '组织编号'
        }
      ],
      searchkey: '',
      delarray: [],
      orginfovisible: false,
      orgform: {
        deptName: '',
        deptCode: '',
        remark: ''
      },
      // 是否新建
      isnew: false
    }
  },
  methods: {
    resetdata() {
      this.orgform = {
        deptName: '',
        deptCode: '',
        remark: ''
      }
    },
    refreshtable(curnodedata) {
      this.tabledata = []
      // this.tabledata.push({ ...data, isparent: true }) // 添加当前节点
      fetchorglazy(curnodedata.id).then(response => {
        if (response.data.msg === 'success') {
          const data = response.data.data
          this.tabledata.push({ ...curnodedata, isparent: true }) // 添加当前节点
          this.tabledata = this.tabledata.concat(data).map(item => {
            item.createDateFm = this.$moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
            return item
          })
        }
      })
    },
    nodeclick(datatree, node, comp) {
      this.curnodedata = datatree
      this.refreshtable(datatree)
    },
    deleteorg() {
      if (this.delarray.length === 0) return
      this.$confirm('此操作将永久删除组织机构,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var delids = this.delarray.filter(item => {
          return item.isparent
        })
        deleteorgbyid(delids.length > 0 ? delids.map(item => { return item.id }) : this.delarray.map(item => { return item.id })).then(response => {
          if (response.data.msg === 'success') {
            // 如果成功，页面根据id进行假删 待完成
            if (delids.length > 0) {
              this.tabledata = []
              this.refreshtree(true)
            } else {
              this.refreshtree()
              this.refreshtable(this.curnodedata)
            }
            this.orginfovisible = false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    selectionchange(selectdata) {
      this.delarray = selectdata
    },
    rowclick(row, event, column) {
      this.isnew = false
      this.orginfovisible = true
      this.orgform = { ...row }
    },
    // 刷新树
    refreshtree(isparent) {
      var currentNode = this.$refs.orgtree.$refs.orgtree.currentNode
      if (currentNode === null) { return }
      if (isparent) {
        currentNode.node.parent.loaded = false
        currentNode.node.parent.loadData()
      } else if (this.isnew || !isparent) {
        currentNode.node.loaded = false
        currentNode.node.loadData()
      }
    },
    // 保存或者更新组织机构
    saveorg() {
      switch (this.isnew) {
        case true:
          // saveorgbypid
          saveorgbypid(this.orgform).then(response => {
            if (response.data.msg === 'success') {
              this.$message('保存成功')
              // const parentkey = this.$refs.orgtree.$refs.orgtree.getCurrentNode().id
              // this.$refs.orgtree.$refs.orgtree.append(this.orgform, parentkey)
              // this.nodeclick(this.orgform)
              this.refreshtree()
              this.refreshtable(this.curnodedata)
              this.orginfovisible = false
            }
          })
          break
        case false:
          updateorgbyid(this.orgform).then(response => {
            if (response.data.msg === 'success') {
              this.$message('更新成功')
              if (this.orgform.isparent) {
                this.refreshtree(true)
              } else {
                this.refreshtree()
              }
              this.refreshtable(this.curnodedata)
              this.orginfovisible = false
            }
          })
          break
      }
    },
    // 新增组织机构
    addorg() {
      var currentNode = this.$refs.orgtree.$refs.orgtree.getCurrentNode()
      if (currentNode === null) { // 未选择树提示选择并退出
        this.$message({
          message: '请选择组织机构',
          type: 'warning'
        })
        return
      }
      this.isnew = true
      this.orginfovisible = true
      this.orgform.parentId = currentNode.id
    },
    dialogclose() {
      this.$refs['orgform'].resetFields()
      this.resetdata()
    },
    loaded() {
      if (!this.$refs.orgtree) return
      this.$refs.orgtree.$refs.orgtree.setCurrentKey(this.curnodedata.id)
    }
  }
}
</script>

<style>
</style>

