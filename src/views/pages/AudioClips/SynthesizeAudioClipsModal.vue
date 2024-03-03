<script setup>
import { initToggle } from "@/composable/toggle";
import { useToast } from "vue-toastification";
import SynthesizeAudioClipsForm from "@/views/pages/AudioClips/SynthesizeAudioClipsForm.vue";

const props = defineProps({
  value: {
    type: Boolean
  }
})

const toast = useToast()
const router = useRouter()
const emit = defineEmits(['update:modelValue', 'audioclips:added'])


const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})

const handlerAdd = (data) => {
  emit('audioclips:added', data)
}
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="768">
     <SynthesizeAudioClipsForm
       @audioclips:added="handlerAdd"
     />
  </VDialog>
</template>
