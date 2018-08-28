<template>
  <div @todictdata="todictdata">
    <component :is="showwhich" @todictdata="todictdata" @todict="todict" :dict="dict"></component>
  </div>
</template>

<script>
import dict from './components/dict'
import dictdata from './components/dictdata'
export default {
  components: {
    dict,
    dictdata
  },
  data() {
    return {
      showwhich: 'dict',
      dict: {}
    }
  },
  methods: {
    todictdata(dict) {
      this.showwhich = 'dictdata'
      this.dict = dict
    },
    todict() {
      this.showwhich = 'dict'
    }
  }
}
</script>

