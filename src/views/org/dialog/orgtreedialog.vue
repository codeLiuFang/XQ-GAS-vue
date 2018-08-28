<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogvisible" :width="'250px'" @close="close">
      <orgtree style="border-right:none;min-height:400px;" class="dialogtree" ref="dialogtree"></orgtree>
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="treeok">确定</el-button>
        <el-button size="mini" @click="dialogvisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import orgtree from '../components/orgtree'
export default {
  watch: {
    visible(newvalue, oldvalue) {
      this.dialogvisible = newvalue
    }
  },
  components: {
    orgtree
  },
  props: {
    title: {
      type: String,
      default: '选择组织机构'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogvisible: false
    }
  },
  methods: {
    treeok() {
      var nodedata = this.$refs['dialogtree'].$refs['orgtree'].getCurrentNode()
      if (nodedata === null) {
        this.$message('请选择组织机构')
        return
      }
      this.$emit('ok', nodedata)
      this.dialogvisible = false
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style>
.dialogtree .el-tree-node {
  /* width: 100%; */
  min-width: 210px;
}
</style>

