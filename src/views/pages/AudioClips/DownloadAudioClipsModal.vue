<script setup>
import { initToggle } from "@/composable/toggle";
import DownloadAudioClipsForm from "@/views/pages/AudioClips/DownloadAudioClipsForm.vue";

const props = defineProps({
  value: {
    type: Boolean
  }
})
const emit = defineEmits(['update:modelValue', 'audioclips:added'])

const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})

const audioclipsAdded = (data) => {
  emit('audioclips:added', data)
}
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="512">
    <DownloadAudioClipsForm
      @audioclips:added="audioclipsAdded"
      :form="c"
    />
  </VDialog>
</template>

<style scoped lang=" scss">

</style>
