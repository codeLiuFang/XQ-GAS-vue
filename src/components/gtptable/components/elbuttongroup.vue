<template>
  <div style="text-align:center;" class="elbuttongroup">
    <!-- <el-button type="success" icon="fa fa-users" circle size="mini" @click="eventbus('success',...arguments)" title="分配角色"></el-button> -->
    <!-- <el-button type="info" icon="el-icon-setting" circle size="mini" @click="eventbus('info',...arguments)" :title="'其他操作'"></el-button> -->
    <!-- fa fa-eraser -->
    <el-button v-for="item in column.groups" :key="item.id" :type="item.type" :icon="item.classnamelist" circle size="mini" @click="eventbus(item.id,...arguments)" :title="item.title"></el-button>
  </div>
</template>

<script>
/* 示例用法
{
  showname: '操作',
  type: 'elbuttongroup',
  width: '135px',
  groups: [
    {
      type: 'success', // element-ui的默认几种方式
      id: 'success',  // 同上
      classnamelist: 'fa fa-users',  // font-awesome 的css样式 也可以自定义图标样式进行更改
      title: '分配角色'  // 鼠标悬停显示的提示信息
    }
  ]
}
*/
import 'font-awesome/css/font-awesome.min.css'
export default {
  props: {
    scope: {
      type: Object,
      default() {
        return {}
      }
    },
    column: {
      type: Object,
      default() {

      }
    }
  },
  methods: {
    eventbus(dispatchid, event) {
      // eventbus事件分发方式更改  格式 参数1 分发id  参数2 事件对象， 参数3 scope对象，包含表格的index row column 参数4 表格配置column
      this.$emit('eventbus', dispatchid, event, this.scope, this.column)
    }
  }
}
</script>
<style>
.elbuttongroup .el-button--mini.is-circle {
  padding: 4px;
}
</style>

