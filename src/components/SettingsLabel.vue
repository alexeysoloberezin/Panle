<template>
  <TooltipInfo v-if="reverse" :text="$t('settings.' + labelKey + 'T')" class="mr-2"/>
  <label :for="labelKey">{{ $t('settings.' + labelKey) }}</label>
   <TooltipInfo v-if="!reverse" :text="$t('settings.' + labelKey + 'T')" class="ml-2"/>
</template>

<script setup>
import TooltipInfo from "@/components/TooltipInfo.vue";
defineProps({
  labelKey: {
    type: String,
    default: ''
  },
  reverse: {
    type: Boolean,
    defaultValue: false
  }
})
</script>

<style scoped>

</style>
