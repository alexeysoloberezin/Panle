<template>
  <VChip
    label
    class="myChip"
    :class="notUppercase ? 'myChip-notUppercase' : ''"
    :color="settings.color"
  >
    {{ settings.value }}
  </VChip>
</template>

<script setup>
const props = defineProps(['value', 'notUppercase'])

const settings = computed(() => {
  if(typeof props.value === 'boolean'){
    return {
      color: props.value ? 'success' : 'error',
      value: props.value ? "Yes" : "No"
    }
  }
  if(typeof props.value === 'string' && props.value.includes(":")){
    return {
      color: 'info',
      value: props.value
    }
  }
  return {
    color: 'primary',
    value: props.value
  }
})
</script>

<style lang="scss">
.myChip{
  width: fit-content;
  height: initial !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  &.myChip-notUppercase{
    *{
      text-transform: initial !important;
    }
  }
  .v-chip__content{
    white-space: pre-wrap;
    text-align: right;
  }
}
</style>
