<template>
  <div class="d-flex align-center flex-column">
    <div class="text-md-h6">{{ $t('data.loading') }}</div>
    <v-progress-circular
      indeterminate
      color="primary"
      class="my-2"
    ></v-progress-circular>
  </div>
</template>

<script setup>
const props = defineProps(['show'])
</script>

<style scoped>

</style>
