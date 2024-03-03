<script setup>
import { useToast } from "vue-toastification";
import { useAudioClipsStore } from "@/store/audioClips";
import { loadAudioClips } from "@/composable/audioClips/loadAudioClips.js";
import DownloadAudioClipsForm from "@/views/pages/AudioClips/DownloadAudioClipsForm.vue";
import SynthesizeAudioClipsForm from "@/views/pages/AudioClips/SynthesizeAudioClipsForm.vue";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const storeAudioClips = useAudioClipsStore();
const currentAudioClip = ref(null);

onMounted(async () => {
  if (!storeAudioClips.getAudioClips[route.params.id]) {
    await loadAudioClips();
  }
  currentAudioClip.value = storeAudioClips.getAudioClips[route.params.id]
  tab.value = currentAudioClip.value.speaker ? 'sinez' : 'download'
})

const handlerAdded = async () => {
  setTimeout(async () => {
    await loadAudioClips();
    // await router.push({ name: 'audioclips' })
  }, 500)
}

const tab = ref('download')
</script>

<template>
  <v-tabs
    v-model="tab"
    class="mb-2"
  >
    <v-tab value="download">Загрузить</v-tab>
    <v-tab value="sinez">Синтезировать</v-tab>
  </v-tabs>
  <v-window v-model="tab">
    <v-window-item value="download">
      <DownloadAudioClipsForm v-if="currentAudioClip" @audioclips:added="handlerAdded" :filename="currentAudioClip.filename" :is-edit="true" :form="currentAudioClip"/>
    </v-window-item>

    <v-window-item value="sinez">
      <SynthesizeAudioClipsForm v-if="currentAudioClip" @audioclips:added="handlerAdded"  :is-edit="true" :form="currentAudioClip"/>
    </v-window-item>
  </v-window>
</template>
