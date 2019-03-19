<template>
  <div>
    <component :is="currentRole"></component>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Layout from './Layout'
import demo from './demo'
export default {
  name: 'dashboard',
  components: { Layout, demo },
  data() {
    return {
      currentRole: 'Layout'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // console.log(this.roles)
    // console.log(this.permission_routers)
    // 普通用户不加载框架
    if (this.roles.includes('普通用户')) {
      this.currentRole = 'demo'
    }
    // } else {
    //   // this.demo[0].name = '气量填报'
    //   this.currentRole = 'demo'
    // }
  }
}
</script>
