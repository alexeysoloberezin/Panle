<script setup>
import SelectAudioClip from "@/views/pages/AudioClips/SelectAudioClipModal.vue";
import { toggleChangeViaVModel } from "@/composable/toggle";
import { loadAudioClips } from "@/composable/audioClips/loadAudioClips";
import AddAudioClips from "@/views/pages/AudioClips/AddAudioClipsModal.vue";
import { useAudioClipsStore } from "@/store/audioClips";
import AudioClipChip from "@/components/AudioClips/AudioClipChip.vue";
import {useI18n} from "vue-i18n/dist/vue-i18n";
// Initial Data
const {t} = useI18n()
const props = defineProps({
  value: {
    type: Object
  },
  title: {
    type: String,
    required: false,
    default: 'Проиграть ролик после нажатия:'
  },
  ivr_blocks: {
    type: Array,
    required: false
  },
  showError: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
  },
  class_row: {
    type: String,
    default: 'pa-3'
  }
})
const emit = defineEmits(['update:modelValue'])
const value = toggleChangeViaVModel(props.value, (e) => {
  emit('update:modelValue', e)
})
const isOpenSelectAudioClip = ref(false)
const isOpenAddAudioModal = ref(false)

// Functions
const handleAudioClipsSelected = (id) => {
  value.value.audioClip = {};
  value.value.audioClip.id = id;
}

const handleAdded = async (data) => {
  await loadAudioClips();
  value.value.audioClip.id = data.id;
}
</script>

<template>
  <VRow :class="props.class_row" no-gutters>
    <VCol
      cols="12"
      md="3"
      class="d-flex align-center"
    >
      <label>{{ props.title }}</label>
    </VCol>

    <VCol
      cols="12"
      md="9"
    >
      <div class="d-flex">
        <VBtn
          class="mr-2"
          @click="isOpenSelectAudioClip = true"
        >{{ $t('data.helpers.chooseAudio') }}
        </VBtn>
        <VBtn color="success" @click="isOpenAddAudioModal = true">{{ $t('actions.launch') }}</VBtn>
      </div>
      <AudioClipChip
        v-if="value.audioClip?.id"
        closable
        :id="value.audioClip.id"
        class="mt-2"
        @click:close="value.audioClip.id = null"/>
      <div v-if="showError" class="text-error mt-1 pl-4" style="font-size: 12px">{{ errorMessage || $t('data.helpers.audioRequired') }}</div>
    </VCol>
    <SelectAudioClip v-model="isOpenSelectAudioClip" @audioclips:selected="handleAudioClipsSelected"/>
    <AddAudioClips
      v-model="isOpenAddAudioModal"
      @audioclips:added="handleAdded"
    />
  </VRow>
</template>
