<script setup>
const props = defineProps({
  show: Boolean
})
</script>

<template>
  <div class="position-relative fake-overlay">
    <VDialog
      scrim="#BDBDBD"
      persistent
      contained
      :model-value="props.show"
      content-class="align-center justify-center d-flex"
    >
      <VProgressCircular
        color="primary"
        indeterminate
        size="100"
        width="10"
      />
    </VDialog>
  </div>
</template>

<style scoped lang="scss">
.fake-overlay {
  min-height: 400px;
  width: 100%;
}
</style>
