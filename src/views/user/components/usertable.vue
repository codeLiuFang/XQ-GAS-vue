<template>
  <div>
    <!-- 用户管理 -->
    <el-row>
      <div style="margin-top:5px;">
        <el-row>
          <el-col :span="12">
            <span style="padding-left:5px;line-height:32px;">用户列表</span>
          </el-col>
          <el-col style="text-align:right;padding-right:5px;" :span="12">
            <el-button type="primary" size="small" @click="showsearchbar=!showsearchbar">{{showsearchbar?'隐藏':'查询'}}</el-button>
            <el-button type="primary" size="small" @click="adddata">新增</el-button>
            <el-button size="small" @click="deletedata">删除</el-button>
          </el-col>
        </el-row>
        <hr class="fengeline">
        <el-row style="margin-left:5px;" v-show="showsearchbar">
          <span>用户名: </span>
          <el-input v-model="sdataform.name" style="width:200px;"></el-input>
          <el-button type="primary" size="small" @click="searchdata">查询</el-button>
        </el-row>
      </div>
      <div>
        <asyndynamictable :fetchurl="fetchurl" :columns="columns" :tabledata="tabledata" :showmulti="true" @selectionchange="selectionchange" @rowclick="rowclick" @handleresponse="handleresponse" ref="usertable" :searchparams="searchparams" @eventbus="eventbus"></asyndynamictable>
      </div>
    </el-row>
    <el-dialog title="新增用户" :visible.sync="forminfovisible" @close="dialogclose">
      <div>
        <el-form ref="dataform" label-width="80px" label-position="left" :model="dataform" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="dataform.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-show="isnew">
            <el-input v-model="dataform.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkpassword" v-show="isnew">
            <el-input v-model="dataform.checkpassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dataform.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="dataform.sex"></el-input>
          </el-form-item>
          <el-form-item label="用户部门" prop="department">
            <el-input v-model="dataform.departmentName" :readonly="true" @focus="orgvisible = true"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="dataform.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dataform.mobile"></el-input>
          </el-form-item>
          <el-form-item label="办公电话" prop="phone">
            <el-input v-model="dataform.phone"></el-input>
          </el-form-item>
          <el-form-item label="备注信息" prop="remarks">
            <el-input type="textarea" v-model="dataform.remarks"></el-input>
          </el-form-item>
          <el-form-item label="更新时间" v-if="!isnew">
            {{dataform.updateDate}}
          </el-form-item>
        </el-form>
        <div style="text-align:center;">
          <el-button type="primary" size="small" @click="savedata">{{isnew?'保存':'更新'}}</el-button>
          <el-button size="small" @click="forminfovisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <orgtreedialog :visible="orgvisible" @close="orgvisible=false" @ok="treeok"></orgtreedialog>
    <actordialog :visible="actorvisible" @close="actorvisible=false" @ok="actorok"></actordialog>
  </div>
</template>
<script>
import asyndynamictable from '@/components/gtptable/asyndynamictable'
// import dynamictable from '@/components/gtptable/dynamictable'
import { adduser, updateuser, deleteuser, assignactorbyid } from '@/api/user'
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
              id: 'success',
              classnamelist: 'fa fa-users',
              title: '分配角色'
            }
          ]
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
    adddata() {
      this.isnew = true
      this.forminfovisible = true
    },
    deletedata() {
      if (this.delarray.length === 0) return
      this.$confirm('此操作将永久删除用户,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteuser(this.delarray).then(response => {
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
    validatedata() {
      let flag = false
      this.$refs['dataform'].validate((valid) => {
        flag = valid
      })
      return flag
    },
    savedata() {
      if (!this.validatedata()) { return }
      switch (this.isnew) {
        case true: // 新增
          adduser(this.dataform).then(response => {
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
          updateuser(this.dataform).then(response => {
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
      this.searchparams.name = this.sdataform.name
      this.searchparams.department = ''
      this.$refs.usertable.refresh()
    },
    dialogclose() {
      // 调用此只是为了清除一些验证信息
      this.$refs['dataform'].resetFields()
      // 个人感觉是elementui的缺陷bug resetFields选项并不能真正清空表单 此处单独处理 而是清空到第一次表单显示的值
      this.resetdata()
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
</style>


