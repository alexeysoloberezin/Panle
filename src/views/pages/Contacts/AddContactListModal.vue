<script setup>
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import { helpers, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { initToggle } from "@/composable/toggle";
import { clearForm } from "@/js/utils/helpers";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const toast = useToast()
const router = useRouter()
const emit = defineEmits(['update:modelValue', 'contacts:added'])
const props = defineProps({
  value: {
    type: Boolean
  }
})
const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})

const isLoading = ref(false)

const initialForm = {
  title: '',
  contacts_file: null,
}

const form = reactive({
  ...initialForm
})

// Functions
const {t} = useI18n()
const rules = {
  title: { required: helpers.withMessage(t('data.helpers.nameRequired'), required) },
  contacts_file: {
    required: helpers.withMessage(t('data.helpers.fileRequired'), required),
  },
  $validationGroups: {
    contactListModa: ['title', 'contacts_file']
  },
  // contacts_file: { required: helpers.withMessage('Необходимо загрузить файл', required) },
}

const v$ = useVuelidate(rules, form)

const handleCreateContactsList = async () => {
  await v$.value.$validate()
  const { $errors } = v$.value.$validationGroups.contactListModa
  if (Array.isArray($errors) && $errors.length > 0)  return null;

  isLoading.value = true;
  const file = form.contacts_file?.[0];

  await createContactsList({
    title: form.title,
    contacts_file: file
  });
}


const createContactsList = async (data) => {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  const res = await request.post(endpoints.contacts.CREATE_LIST, formData);
  if (res.status === 201) {
    emit('contacts:added', res.data)

    setTimeout(() => {
      clearForm(form, initialForm, v$);
      toast.info(t('notifications.contactsQueued'));
      isOpen.value = false;
    }, 150)
  }
  isLoading.value = false;
}

let lastFilename = '';
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

const host = computed(() => import.meta.env.VITE_HOST)
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="512">
    <VCard class="Vertical">
      <VCardTitle>{{ $t('data.title.addContacts') }}</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="handleCreateContactsList" ref="formRef">
          <VRow no-gutters class="mb-4">
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                :error-messages="v$.title.$errors.map(e => e.$message)"
                @input="v$.title.$touch"
                @blur="v$.title.$touch"
                id="title"
                v-model="form.title"
                placeholder=""
                :label="$t('form.labels.name')"
              />
            </VCol>
          </VRow>
          <VRow no-gutters class="mb-4">
            <VCol
              cols="12"
              md="12">
              <label for="contacts_file">{{ $t('form.uploadExcelContacts') }}:</label>
              <VBtn
                :href="`${host}/public/general/default.xlsx`"
                class="ml-2 mb-1"
                variant="outlined"
                size="x-small"
              >{{ $t('data.example') }}
              </VBtn>
            </VCol>
            <VFileInput
              id="contacts_file"
              v-model="form.contacts_file"
              accept=".xlsx"
              :error-messages="v$.contacts_file.$errors.map(e => e.$message)"
              @update:model-value="handleChangeFile"
              :label="$t('form.uploadPhones')"
            />
          </VRow>
          <VBtn type="submit" :disabled="isLoading" :loading="isLoading">{{ $t('actions.launch') }}</VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
