<template>
  <div>
    <component :is="whichcomp" @toactoruser="toactoruser" @toactor="toactor" :transdata="transdata"></component>
  </div>
</template>
<script>
import actor from './components/actor'
import actoruser from './components/actoruser'
export default {
  components: {
    actor,
    actoruser
  },
  data() {
    return {
      whichcomp: 'actor',
      transdata: {}
    }
  },
  methods: {
    toactoruser(obj) {
      this.whichcomp = 'actoruser'
      this.transdata = obj
    },
    toactor() {
      this.whichcomp = 'actor'
    }
  }
}
</script>
