<script setup>
import {useToast} from "vue-toastification";
import {initToggle} from "@/composable/toggle";
import {helpers, maxLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {endpoints} from "@/js/utils/actions/endpoints";
import {request} from "@/js/utils/actions/request";
import {clearForm} from "@/js/utils/helpers";
import AudioClipPlay from "@/components/AudioClips/AudioClipPlay.vue";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const props = defineProps(['isEdit', 'form', 'filename'])
const emit = defineEmits(['audioclips:added'])
const toast = useToast()
const isLoading = ref(false)

let lastFilename = '';

const initialForm = {
  title: '',
  audio_file: null,
  filename: props.filename || null,
  comment: '',
  speaker: ''
}
const form = reactive(props?.form || {
  ...initialForm
})
const formRef = ref(null)
const {t} = useI18n()
const rules = {
  title: {required: helpers.withMessage(t('data.helpers.nameRequired'), required), maxLength: maxLength(2000)},
  audio_file: {
    // required: helpers.withMessage('Необходимо загрузить ролик', required),
  },
  $validationGroups: {
    downloadAudioClipsModal: ['title', 'audio_file']
  },
}
const fileRules = [
  value => {
    return !value || !value.length || value[0].size < 20000000 || t('data.helpers.fileSize', {fileSize: '20 MB'})
  },
]
const v$ = useVuelidate(rules, form)
// Functions

const handleChangeFile = (files) => {
  if (!form.title && files.length) {
    const filename = files[0].name
    lastFilename = filename.substring(0, filename.lastIndexOf('.')) || filename
    form.title = lastFilename
  }
  if (!files.length && form.title === lastFilename) {
    form.title = ''
    lastFilename = ''
  }
}

const createAudioClip = async () => {
  await v$.value.$validate()
  const {$errors} = v$.value.$validationGroups.downloadAudioClipsModal
  if (Array.isArray($errors) && $errors.length > 0) return null;

  const {valid} = await formRef.value.validate()

  if (!valid) return null

  const file = form.audio_file?.[0];

  let data;

  if(props?.isEdit){
    data = { title: form.title, id: form.id, text: form?.text || '', comment: form?.comment || '', filename: form.filename, audio_file: form.audio_file}
  }else{
    data = { title: form.title,  text: form?.text || '', comment: form?.comment || '', filename: form.filename, audio_file: form.audio_file}
  }

  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  formData.set('audio_file', file)

  const endpoint = props?.isEdit ? endpoints.audioClips.EDIT : endpoints.audioClips.CREATE

  const res = await request.post(endpoint, formData);
  if (res.status === 201) {
    toast.success(t('notifications.audioClipAdded'));
    setTimeout(() => {
      emit('audioclips:added', res.data);
      clearForm(form, initialForm);
    }, 500)
  }
  isLoading.value = false;
}
</script>

<template>
  <VCard class="Vertical py-3">
    <VCardTitle>{{ $t('data.title.addAudio') }}</VCardTitle>
    <VCardText>
      <VForm @submit.prevent="() => {}" ref="formRef">
        <VRow no-gutters class="mb-4">
          <VCol
            cols="12"
            md="12"
          >
            <VTextField
              id="title"
              :error-messages="v$.title.$errors.map(e => e.$message)"
              @input="v$.title.$touch"
              @blur="v$.title.$touch"
              v-model="form.title"
              placeholder=""
              :label="$t('form.labels.nameAudio')"
            />
          </VCol>
        </VRow>
        <VRow v-if="filename" class="mb-4">
          <VCol>
            <div class="d-flex align-center gap-3">
              <AudioClipPlay class="mt-1" :path="form.filename"/>
              <VBtn @click="form.filename = null" variant="outlined">{{ $t('actions.delete') }}</VBtn>
            </div>
          </VCol>
        </VRow>
        <VRow v-else no-gutters class="mb-4">
          <VCol
            cols="12"
            md="12"
          >
            <VFileInput
              id="audio_file"
              v-model="form.audio_file"
              :error-messages="v$.audio_file.$errors.map(e => e.$message)"
              :rules="fileRules"
              accept="audio/*"
              :label="$t('form.uploadAudio')"
              @update:model-value="handleChangeFile"
              @change="v$.audio_file.fileSize"
            />
          </VCol>
        </VRow>
        <VRow no-gutters class="mb-4">
          <VCol
            cols="12"
            md="12">
            <VTextarea
              id="comment"
              v-model="form.comment"
              :label="$t('form.comment')"
            ></VTextarea>
          </VCol>
        </VRow>
        <VBtn type="button" @click="createAudioClip" :loading="isLoading" :disabled="isLoading">{{ $t('actions.add') }}</VBtn>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style scoped lang=" scss">

</style>
