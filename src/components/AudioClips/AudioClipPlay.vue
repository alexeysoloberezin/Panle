<script setup>
import { loadAudioClips } from "@/composable/audioClips/loadAudioClips";
import { useAudioClipsStore } from "@/store/audioClips";

const props = defineProps({
  id: {
    type: [String, Number],
    required: false
  },
  class: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false,
    default: ''
  },
  path: {
    type: String,
    required: false
  }
})
const storeAudioClips = useAudioClipsStore()
const audio = ref(storeAudioClips.getAudioClips[props.id]);

const getAudio = async () => {
  if (props.id) {
    if (!storeAudioClips.getAudioClips[props.id]) {
      await loadAudioClips();
    }
    audio.value = storeAudioClips.getAudioClips[props.id];
  }
}

const pathToAudio = computed(() => {
  return props.path || audio.value.filename
})

onMounted(() => {
  getAudio();
})

watch(() => props.id, () => {
  getAudio();
})

const audioType  = computed(() => {
  switch (props?.type){
    case 'record':
      return 'ivr_recordings'
    default:
      return 'ivr_sounds'
  }
})

const host = computed(() => import.meta.env.VITE_HOST)
</script>

<template>
  <audio :class="props.class" controls preload="metadata" :src="`${host}/public/${audioType}/${pathToAudio}`"></audio>
</template>
