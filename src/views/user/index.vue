<template>
  <div>
    <el-row>
      <el-col :span="4" class="leftside">
        <orgtree @nodeclick="nodeclick"></orgtree>
      </el-col>
      <el-col :span="20" class="rightside">
        <usertable :ptabledata="ptabledata" :treedepartment="treedepartment"></usertable>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import orgtree from '@/views/org/components/orgtree'
import usertable from './components/usertable'
export default {
  components: {
    orgtree,
    usertable
  },
  data() {
    return {
      ptabledata: [],
      treedepartment: {}
    }
  },
  methods: {
    nodeclick(data) {
      this.treedepartment = data
    }
  }
}
</script>

