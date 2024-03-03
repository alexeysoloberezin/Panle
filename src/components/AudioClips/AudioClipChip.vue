<script setup>
import { useAudioClipsStore } from "@/store/audioClips";
import { loadAudioClips } from "@/composable/audioClips/loadAudioClips";
import AudioClipPlay from "@/components/AudioClips/AudioClipPlay.vue";

const props = defineProps({
  id: {
    type: [String, Number]
  },
  class: {
    type: String
  },
  closable: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['click:close'])
const storeAudioClips = useAudioClipsStore()
const audio = ref(storeAudioClips.getAudioClips[props.id]);

const getAudio = async () => {
  if (!storeAudioClips.getAudioClips[props.id]) {
    await loadAudioClips();
  }
  audio.value = storeAudioClips.getAudioClips[props.id];
}

onMounted(() => {
  getAudio();
})

watch(() => props.id, () => {
  getAudio();
})
</script>

<template>
  <VChip
    v-if="audio?.id"
    :closable="props.closable"
    @click:close="emit('click:close')"
    :class="props.class"
    size="x-large"
    class="pl-0"
  >
    <AudioClipPlay :id="audio.id" class="mr-2"/>
    {{ storeAudioClips.getAudioClips[props.id]?.title }}
  </VChip>
</template>
