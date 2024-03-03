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
const value = toggleChangeViaVModel(props.value, (e) => {
  emit('update:modelValue', e)
})

const options = [
  {title: 'Служебные номера', value: 'default'}
]
</script>

<template>
  <VRow class="pa-3" no-gutters>
    <VCol
      cols="12"
      md="3"
      class="d-flex align-center"
    >
      <label>Укажите текст СМС:</label>
    </VCol>

    <VCol
      cols="12"
      md="9"
    >
      <VTextarea rows="2" v-model="value.text"/>
    </VCol>
  </VRow>
  <VRow class="pa-3" no-gutters>
    <VCol
      cols="12"
      md="3"
      class="d-flex align-center"
    >
      <label>Имя отправителя:</label>
    </VCol>
    <VCol
      cols="12"
      md="9"
    >
      <VSelect v-model="value.name" :items="options"/>
    </VCol>
  </VRow>
  <WriteDownAnswer v-model:value="value"/>
</template>
