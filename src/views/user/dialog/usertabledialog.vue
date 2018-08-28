<template>
  <div>
    <!-- 用户管理 -->
    <el-dialog title="选择用户" :visible.sync="visible" :before-close="close" class="usertabledialog">
      <el-row>
        <div style="margin-top:5px;">
          <el-row>
            <el-col :span="12">
              <span style="padding-left:5px;line-height:32px;">用户列表</span>
            </el-col>
            <el-col style="text-align:right;padding-right:5px;" :span="12">
              <el-button type="primary" size="small" @click="showsearchbar=!showsearchbar">{{showsearchbar?'隐藏':'查询'}}</el-button>
            </el-col>
          </el-row>
          <hr class="fengeline">
          <el-row style="margin-left:5px;" v-show="showsearchbar">
            <span>用户名: </span>
            <el-input v-model="sdataform.name" style="width:200px;"></el-input>
            <el-button type="primary" size="mini" @click="searchdata">查询</el-button>
          </el-row>
        </div>
        <div>
          <asyndynamictable :fetchurl="fetchurl" :columns="columns" :tabledata="tabledata" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick" @handleresponse="handleresponse" ref="usertable" :searchparams="searchparams" @eventbus="eventbus" :pagesizes="[5,20,40,60]" :layout="'total, sizes, prev, pager, next'"></asyndynamictable>
        </div>
        <div style="text-align:center;margin-bottom:5px;">
          <el-button type="primary" size="mini" @click="ok">确定</el-button>
          <el-button size="mini" @click="close">取消</el-button>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import asyndynamictable from '@/components/gtptable/asyndynamictable'
// import dynamictable from '@/components/gtptable/dynamictable'
import { assignactorbyid } from '@/api/user'
import orgtreedialog from '@/views/org/dialog/orgtreedialog'
import actordialog from '@/views/actor/dialog/actordialog'
export default {
  watch: {
    ptabledata(newval, oldval) {
      this.tabledata = newval
    },
    treedepartment(newval, oldval) {
      this.refreshtable()
    }
  },
  computed: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    treedepartment: {
      type: Object,
      default() {
        return {}
      }
    },
    ptabledata: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    // dynamictable,
    actordialog,
    orgtreedialog,
    asyndynamictable
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.dataform.checkpassword !== '') {
          this.$refs.dataform.validateField('checkpassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataform.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      searchparams: {
        name: '',
        department: ''
      },
      fetchurl: '/users',
      showsearchbar: false,
      orgvisible: false,
      actorvisible: false,
      dataform: {
        username: '',
        name: '',
        password: '',
        checkpassword: '',
        sex: '',
        department: '',
        email: '',
        mobile: '',
        phone: '',
        remarks: ''
      },
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
        }
      ],
      tabledata: [],
      forminfovisible: false,
      isnew: false,
      sdataform: {
        name: ''
      },
      delarray: [],
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkpassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      currentuser: {}
    }
  },
  methods: {
    ok() {
      this.$emit('ok', this.delarray)
      this.close()
    },
    eventbus(dispatchid, event, columnscope, columndefine) {
      // console.log(...arguments)
      switch (dispatchid) {
        case 'success':
          this.currentuser = columnscope.row
          this.actorvisible = true
          break
        case 'warning':
          break
      }
    },
    treeok(data) {
      this.dataform.departmentName = data.deptName
      this.dataform.department = data.id
    },
    actorok(actorsid) {
      // actorids
      assignactorbyid(this.currentuser.id, actorsid).then(response => {
        if (response.data.msg === 'success') {
          this.$message('保存成功')
        }
      })
    },
    rowclick(row, event, column) {
      this.isnew = false
      switch (column.label) {
        case '用户类型':
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
      this.searchparams.name = this.sdataform.name
      this.searchparams.department = this.treedepartment.id
      this.$refs.usertable.refresh()
    },
    resetdata() {
      this.dataform = {
        username: '',
        name: '',
        password: '',
        checkpassword: '',
        sex: '',
        department: '',
        email: '',
        mobile: '',
        phone: '',
        remarks: ''
      }
    },
    validatedata() {
      let flag = false
      this.$refs['dataform'].validate((valid) => {
        flag = valid
      })
      return flag
    },
    searchdata() {
      this.searchparams.name = this.sdataform.name
      this.searchparams.department = ''
      this.$refs.usertable.refresh()
    },
    close() {
      this.$emit('changevisible', false)
      this.$refs.usertable.clearSelection()
    },
    handleresponse(response) {
      if (response.data.msg === 'success') {
        this.tabledata = response.data.data.rows
      }
    }
  },
  created() {
    // this.refreshtable()
  }
}
</script>
<style>
/* .dicttable table tr td:nth-child(3) {
  cursor: pointer;
  color: #3c8dbc;
} */
.usertabledialog .el-dialog__header {
  padding: 5px 5px;
}
.usertabledialog .el-dialog__body {
  padding: 0px 5px;
}
</style>


