<template>
  <div>
    <el-row style="margin-top:5px;">
      <el-col :span="12">
        <span style="padding-left:5px;line-height:32px;cursor:pointer;" @click="toactor">
          <i class="el-icon-d-arrow-left"></i>
          {{`${transdata.row.name}(用户列表)`}}
        </span>
      </el-col>
      <el-col :span="12" style="text-align:right;padding-right:5px;">
        <el-button type="primary" size="small" @click="adduser">添加用户</el-button>
      </el-col>
    </el-row>
    <hr class="fengeline">
    <el-row>
      <dynamictable :columns="columns" :tabledata="transdata.tabledata" style="margin:0 5px;" @eventbus="eventbus"></dynamictable>
    </el-row>
    <usertabledialog :visible="usertablevisible" @changevisible="usertablevisible=$event" @ok="usertabledialogok"></usertabledialog>
  </div>
</template>
<script>
import dynamictable from '@/components/gtptable/dynamictable'
import usertabledialog from '@/views/user/dialog/usertabledialog'
import { assignusersbyactorid, unassignusersbyactorid, getusersbyactorid } from '@/api/actor'
export default {
  props: {
    transdata: {
      type: Object,
      default() {
        return {
          tabledata: [],
          row: {}
        }
      }
    }
  },
  components: {
    dynamictable,
    usertabledialog
  },
  data() {
    return {
      usertablevisible: false,
      columns: [
        {
          showname: '用户名',
          dataindex: 'username'
        },
        {
          showname: '姓名',
          dataindex: 'name'
        },
        {
          showname: '性别',
          dataindex: 'sex'
        },
        {
          showname: '部门',
          dataindex: 'department'
        },
        {
          showname: '手机号码',
          dataindex: 'mobile'
        },
        {
          showname: '办公电话',
          dataindex: 'phone'
        },
        {
          showname: '邮箱',
          dataindex: 'email'
        },
        {
          showname: '操作',
          type: 'elbuttongroup',
          width: '135px',
          groups: [
            {
              type: 'success',
              id: 'unassignactor',
              classnamelist: 'fa fa-window-close',
              title: '取消授权'
            }
          ]
        }
      ]
    }
  },
  methods: {
    refreshtable() {
      getusersbyactorid(this.transdata.row.id).then(response => {
        if (response.data.msg === 'success') {
          this.transdata.tabledata = response.data.data
        }
      })
    },
    eventbus(dispatchid, event, columnscope, columndefine) {
      // console.log(...arguments)
      switch (dispatchid) {
        case 'unassignactor':
          unassignusersbyactorid(this.transdata.row.id, [columnscope.row.id]).then(response => {
            if (response.data.msg === 'success') {
              this.$message('取消授权成功')
              this.refreshtable()
            }
          })
          break
      }
    },
    usertabledialogok(userids) {
      assignusersbyactorid(this.transdata.row.id, userids).then(response => {
        if (response.data.msg === 'success') {
          this.$message('分配用户成功')
          this.refreshtable()
        }
      })
    },
    toactor() {
      this.$emit('toactor')
    },
    adduser() {
      this.usertablevisible = true
    }
  }
}
</script>

