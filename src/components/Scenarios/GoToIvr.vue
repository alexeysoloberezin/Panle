<script setup>

import WriteDownAnswer from "@/components/Scenarios/WriteDownAnswer.vue";
import { toggleChangeViaVModel } from "@/composable/toggle";

const props = defineProps({
  value: {
    type: Object
  },
  ivr_blocks: {
    type: Array,
    required: true,
  }
})
const emit = defineEmits(['update:modelValue'])
const value = toggleChangeViaVModel(props.value, (e) => {emit('update:modelValue', e)})

const listIvrBlocks = computed(() => {
  return props.ivr_blocks.map((_, index) => {
    return { value: index + 1, title: `IVR #${index + 1}` }
  })
})
</script>

<template>
  <VRow class="pa-3" no-gutters>
    <VCol
      cols="12"
      md="3"
      class="d-flex align-center"
    >
      <label>Перейти к:</label>
    </VCol>

    <VCol
      cols="12"
      md="9"
    >
      <VSelect
        :items="listIvrBlocks"
        v-model="value.value"
      />
    </VCol>
  </VRow>

  <WriteDownAnswer v-model:value="value"/>
</template>
