<script setup>
import DownloadAudioClipsModal from "@/views/pages/AudioClips/DownloadAudioClipsModal.vue";
import SynthesizeAudioClipsModal from "@/views/pages/AudioClips/SynthesizeAudioClipsModal.vue";
import { initToggle } from "@/composable/toggle";

const props = defineProps({
  value: {
    type: Boolean
  }
})

const isOpenDownloadModal = ref(false);
const isOpenSynthesizeModal = ref(false);

const emit = defineEmits(['update:modelValue', 'audioclips:added'])

const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})

// Functions
const handleAudioClipsAdded = (e) => {
  isOpen.value = false;
  emit('audioclips:added', e);
}
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="auto">
    <VCard>
      <VCardTitle>{{ $t('data.title.addAudio') }}</VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VBtn @click="isOpenDownloadModal = true">{{ $t('actions.uploadAudio') }}</VBtn>
          </VCol>
          <VCol cols="6">
            <VBtn @click="isOpenSynthesizeModal = true">{{ $t('actions.synthesize') }}</VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <DownloadAudioClipsModal v-model="isOpenDownloadModal" @audioclips:added="handleAudioClipsAdded"/>
    <SynthesizeAudioClipsModal v-model="isOpenSynthesizeModal" @audioclips:added="handleAudioClipsAdded"/>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
