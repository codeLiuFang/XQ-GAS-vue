<template>
  <el-tree :props="orgconfig" :load="loadorg" node-key="id" lazy class="orgtree" :highlight-current="true" @node-click="nodeclick" ref="orgtree">
  </el-tree>
</template>
<script>
import { fetchorglazy } from '@/api/org'
export default {
  data() {
    return {
      orgconfig: {
        label: 'deptName',
        children: 'children'
      }
    }
  },
  methods: {
    loadorg(node, resolve) {
      fetchorglazy(node.level === 0 ? '-1' : node.data.id).then(response => {
        const msg = response.data.msg
        if (msg === 'success') {
          const data = response.data.data
          resolve(data)
        } else {
          resolve([])
        }
        this.$emit('loaded')
      }).catch(() => {
        this.$message('树加载失败')
        resolve([])
      })
    },
    nodeclick() {
      this.$emit('nodeclick', ...arguments)
    }
  }
}
</script>
<style>
.orgtree {
  border-right: 1px solid #d8dce5;
  overflow-x: auto;
  min-height: 600px;
  height: 100%;
}
/* css3自适应宽度*/
.el-tree-node {
  width: fit-content;
  min-width: 169px;
}
</style>

