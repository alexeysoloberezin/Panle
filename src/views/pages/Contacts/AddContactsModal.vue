<script setup>
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import { initToggle } from "@/composable/toggle";
import { clearForm } from "@/js/utils/helpers";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const toast = useToast()
const router = useRouter()
const emit = defineEmits(['update:modelValue', 'contacts:added'])
const props = defineProps({
  value: {
    type: Boolean
  },
  list: {
    type: Object
  }
})
const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})

const isLoading = ref(false)

const initialForm = {
  contacts_file: null,
}

const form = reactive({
  ...initialForm
})

const {t} = useI18n()
// Functions
const handleCreateContactsList = () => {
  isLoading.value = true;
  const file = form.contacts_file?.[0];
  createContactsList({
    contacts_file: file
  });
}

const createContactsList = async (data) => {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  formData.append('id', props.list.id)
  const res = await request.post(endpoints.contacts.ADD_CONTACTS, formData);
  if (res.status === 201) {
    isOpen.value = false;
    clearForm(form, initialForm);
    emit('contacts:added')
    setTimeout(() => {
      toast.info(t('notifications.contactsQueued'));
    }, 100)
  }
  isLoading.value = false;
}

</script>

<template>
  <VDialog
    v-model="isOpen"
    width="512">
    <VCard class="Vertical">
      <VCardTitle>{{ $t('data.title.addInContacts') }} </VCardTitle>
      <VCardText>
        <VForm @submit.prevent="handleCreateContactsList">
          <VRow no-gutters class="mb-4">
            <VCol
              cols="12"
              md="12"
            >
              <VCol
                cols="12"
                md="12">
                <label for="contacts_file">Загрузите файл с телефонами в формате Excel:</label>
              </VCol>
              <VFileInput
                id="contacts_file"
                v-model="form.contacts_file"
                accept=".xlsx"
                :label="$t('form.uploadPhones')"
              />
            </VCol>
          </VRow>
          <VBtn type="submit" :loading="isLoading">{{ $t('actions.add') }}</VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
