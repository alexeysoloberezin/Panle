<template>
  <VBtn
    class="mr-2"
    icon
    size="x-small"
    width="25"
    height="25"
    :color="color"
  >
    <VIcon icon="bx-play"/>
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
      default: 'Запустить кампанию'
    },
    color: {
      type: String,
      default: 'success'
    }
  }
)
</script>

<style scoped>

</style>
