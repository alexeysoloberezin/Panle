<script setup>
import {initToggle} from "@/composable/toggle";
import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import {useToast} from "vue-toastification";
import {loadAudioClips} from "@/composable/audioClips/loadAudioClips";
import TooltipInfo from "@/components/TooltipInfo.vue";
import AudioClipPlay from "@/components/AudioClips/AudioClipPlay.vue";
import {valuesSpeaker} from "@/js/audioClip";
import {helpers, maxLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const props = defineProps(['isEdit', 'form'])

const toast = useToast()
const router = useRouter()
const emit = defineEmits(['audioclips:added'])
const sizeLabelMD = 6;
const sizeInputMD = 6;


const optionsFilter = [
  {title: 'русский', value: 'ru'}
]

const optionsSpeaker = Object.entries(valuesSpeaker).map(([key, value]) => {
  return {value: key, title: value}
})
const infoAudioClipText = `В текст ролика можно вставить персонализированное обращение к клиенту по имени. Для этого надо прописать в тексте специальное значение [firstname]`

const form = reactive(props?.form
  ? {text: '', ...props?.form,
    filter: props?.form.filter || optionsFilter[0].value,
    speaker: props?.form.speaker || optionsSpeaker[0].value,
  }
  : {
  title: '',
  text: '',
  filter: optionsFilter[0].value,
  speaker: optionsSpeaker[0].value,
  filename: null
})

const {t} = useI18n()
const rules = {
  title: {required: helpers.withMessage(t('data.helpers.nameRequired'), required), maxLength: maxLength(2000)},
  text: {required: helpers.withMessage(t('data.helpers.textRequired'), required), maxLength: maxLength(2000)},
  $validationGroups: {
    SynthesizeAudioClipModal: ['title', 'text']
  },
}
const v$ = useVuelidate(rules, form)

const isOpenListen = ref(false)

const handleClickListen = async (silence = false) => {
  await v$.value.$validate()
  const {$errors} = v$.value.$validationGroups.SynthesizeAudioClipModal
  if (Array.isArray($errors) && $errors.length > 0) return null;

  const {title, ...data} = form;
  const res = await request.post(endpoints.audioClips.GENERATE_AUDIO, data);
  if (res.status === 201) {
    form.filename = res.data;
    if(!silence){
      isOpenListen.value = true;
    }
  }
}

const handleClickSave = async () => {
  if(props.isEdit){
    await handleClickListen(true);
  }

  const res = await request.post(endpoints.audioClips.GENERATED_AUDIO_SAVE, form);
  if (res.status === 201) {
    setTimeout(() => {
      emit('audioclips:added', res.data)
      toast.success(props?.isEdit ? t('notifications.audioClipModified') : t('notifications.audioClipAdded'))
      router.push('/audioclips')
    }, 1000)
  }
}
const host = computed(() => import.meta.env.VITE_HOST)
</script>

<template>
  <VCard class="Vertical py-3" >
    <VCardTitle>{{ $t('data.title.SyntezAudio') }}</VCardTitle>
    <VCardText>
      <VForm @submit.prevent="() => {}">
        <VRow>
          <VCol cols="12">
            <VRow>
              <VCol
                cols="12"
                :md="sizeLabelMD"
                class="d-flex align-center justify-space-between"
              >
                <label for="pauseStartCall">{{ $t('form.labels.nameAudio') }}</label>
              </VCol>
              <VCol
                cols="12"
                :md="sizeInputMD"
              >
                <VTextField
                  id="title"
                  :error-messages="v$.title.$errors.map(e => e.$message)"
                  @input="v$.title.$touch"
                  @blur="v$.title.$touch"
                  v-model="form.title"
                  :placeholder="$t('form.labels.nameAudio')"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                :md="sizeLabelMD"
                class="d-flex align-center justify-space-between"
              >
                <label for="pauseStartCall">{{ $t('form.labels.textAudi') }}</label>
                <TooltipInfo
                  :html="infoAudioClipText"/>
              </VCol>
              <VCol
                cols="12"
                :md="sizeInputMD">
                <VTextarea
                  id="text"
                  :error-messages="v$.text.$errors.map(e => e.$message)"
                  @input="v$.text.$touch"
                  @blur="v$.text.$touch"
                  v-model="form.text"
                ></VTextarea>
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                :md="sizeLabelMD"
                class="d-flex align-center justify-space-between"
              >
                <label for="pauseStartCall">{{ $t('form.labels.filterLang') }}</label>
              </VCol>
              <VCol
                cols="12"
                :md="sizeInputMD"
              >
                <VSelect
                  id="filter"
                  v-model="form.filter"
                  :items="optionsFilter"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                :md="sizeLabelMD"
                class="d-flex align-center justify-space-between"
              >
                <label for="pauseStartCall">{{ $t('form.labels.dictor') }}</label>
              </VCol>
              <VCol
                cols="12"
                :md="sizeInputMD"
              >
                <VSelect
                  id="speaker"
                  v-model="form.speaker"
                  :items="optionsSpeaker"
                />
              </VCol>
            </VRow>
            <VRow no-gutters class="my-4 d-flex justify-space-between">
              <VBtn type="button" @click="handleClickListen(false)">{{ $t('actions.listen') }}</VBtn>
              <VBtn v-if="form.filename" type="button" @click="handleClickSave">{{ $t('actions.save') }}</VBtn>
            </VRow>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
  <VDialog v-model="isOpenListen" width="auto">
    <VCard class="Vertical">
      <VCardTitle>{{ $t('actions.listen') }}</VCardTitle>
      <VCardText>
        <AudioClipPlay :path="form.filename"/>
      </VCardText>
    </VCard>
  </VDialog>
</template>
