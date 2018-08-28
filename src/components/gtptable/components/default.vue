<template>
  <span>
    {{scope.row[column.dataindex]}}
  </span>
</template>
<script>
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
  }
}
</script>
