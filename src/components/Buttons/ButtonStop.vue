<template>
  <VBtn
    class="mr-2"
    icon
    size="x-small"
    width="25"
    height="25"
    color="error"
  >
    <VIcon icon="mdi-stop"/>
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
      default: 'Остановить'
    }
  }
)
</script>

<style scoped>

</style>
