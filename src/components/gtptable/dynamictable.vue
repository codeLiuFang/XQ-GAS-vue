<template>
  <div style="margin:5px 5px;">
    <el-table :data="tabledatashow" border fit highlight-current-row style="" @selection-change="selectionchange" @row-click="rowclick('rowclick',arguments)" ref="dytable">
      <!-- 设置传入参数 showmulti，是否为多选 -->
      <el-table-column type="selection" width="55" v-if='showmulti' align="center">
      </el-table-column>
      <el-table-column :key='column.id' v-for='column in columns' :label="column.showname" :width="column.width" :align="column.align">
        <template slot-scope="scope">
          <!-- <span>{{scope.row[column.dataindex]}}</span> -->
          <component :is="column.type?column.type:'defaults'" :scope="scope" :column="column" @eventbus="rowclick('eventbus',arguments)"></component>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:5px;" v-if="totalcount">
      <el-pagination :layout="layout" :total="totalcount" :page-size="pagesize" :page-sizes="pagesizes" @current-change="currentpagechange" ref="pages" @size-change="sizechange" :current-page.sync="currentpage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import comps from './components'
export default {
  components: {
    ...comps
  },
  data() {
    return {
      // 分页后需要显示的内容，根据page进行街区tabledata
      tabledatashow: [],
      // 每页显示几条
      pagesize: this.pagesizes[0],
      // 第几页
      currentpage: 1
    }
  },
  // 对外提供的字段 全部提供小写字段不采用驼峰规则
  props: {
    // 表头配置项
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    // 表格数据
    tabledata: {
      type: Array,
      default() {
        return []
      }
    },
    showmulti: { // 是否显示复选框
      type: Boolean,
      default: false
    },
    pagesizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  computed: {
    totalcount() {
      return this.tabledata.length
    }
  },
  methods: {
    selectionchange() {
      // 选择更改事件
      this.$emit('selectionchange', ...arguments)
    },
    rowclick(eventtype, args) {
      if (eventtype === 'eventbus') { // 使用eventbus进行事件处理的，取消冒泡到rowclick
        arguments[1][1].stopPropagation()
        this.$emit('eventbus', ...args)
        return
      }
      this.$emit('rowclick', ...args) // 默认的表格单击事件
    },
    currentpagechange(page) {
      const startindex = (page - 1) * this.pagesize
      const endindex = startindex + this.pagesize
      const slicearray = this.tabledata.slice(startindex, endindex)
      this.tabledatashow = slicearray
    },
    sizechange(pagesize) {
      // console.log(pagesize)
      this.pagesize = pagesize
      this.currentpagechange(this.currentpage)
    },
    clearSelection() {
      this.$refs['dytable'].clearSelection()
    }
  },
  watch: { // 当tabledata变化时
    tabledata(newvalue, oldvale) {
      this.currentpagechange(1)
    }
  },
  created() { // 创建时执行一次
    this.currentpagechange(1)
  }
}
</script>

