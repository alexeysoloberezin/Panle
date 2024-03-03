<script setup>
import WriteDownAnswer from "@/components/Scenarios/WriteDownAnswer.vue";
import { toggleChangeViaVModel } from "@/composable/toggle";

const props = defineProps({
  value: {
    type: Object
  },
  ivr_blocks: {
    type: Array,
    required: false
  }
})
const emit = defineEmits(['update:modelValue'])
const value = toggleChangeViaVModel(props.value, (e) => {emit('update:modelValue', e)})
</script>

<template>
  <WriteDownAnswer v-model:value="value"/>
</template>
