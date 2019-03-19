<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

// export default {
//   name: 'dashboard',
//   components: { adminDashboard, editorDashboard },
//   data() {
//     return {
//       currentRole: 'adminDashboard'
//     }
//   },
//   computed: {
//     ...mapGetters([
//       'roles'
//     ])
//   },
//   created() {
//     if (!this.roles.includes('管理员')) {
//       this.currentRole = 'editorDashboard'
//     }
//   }
// }
import { mapGetters } from 'vuex'
import infoViewDashboard from './infoView'
import gasFill from './gasFill'
export default {
  name: 'dashboard',
  components: { infoViewDashboard, gasFill },
  data() {
    return {
      currentRole: 'gasFill'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'demo',
      'permission_routers'
    ])
  },
  created() {
    console.log(this.roles)
    // console.log(this.permission_routers)
    if (this.roles.includes('管理员')) {
      this.currentRole = 'infoViewDashboard'
      console.log(this.permission_routers[4].children[0].meta.title)
    } else {
      // this.demo[0].name = '气量填报'
      this.permission_routers[4].children[0].meta.title = '气量填报'
    }
  }
}
</script>
