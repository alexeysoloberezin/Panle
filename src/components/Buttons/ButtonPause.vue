<template>
  <VBtn
    class="mr-2"
    icon
    size="x-small"
    width="25"
    height="25"
    color="info"
  >
    <VIcon icon="bx-pause"/>
    <VTooltip
      activator="parent"
    >{{ tooltipText }}
    </VTooltip>
  </VBtn>
</template>

<script setup>
defineProps(
  {
    tooltipText: {
      type: String,
      default: 'Поставить на паузу'
    }
  }
)
</script>

<style scoped>

</style>
