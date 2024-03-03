<script setup>
import { useToast } from "vue-toastification";
import { initToggle } from "@/composable/toggle";

const toast = useToast()
const router = useRouter()
const emit = defineEmits(['update:modelValue', 'update:notification'])
const props = defineProps({
  notifications: {
    type: Object,
    defaultValue: null
  },
  value: {
    type: Boolean
  },
})

const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})

const defaultForm = {
  no_answer: {
    method: "GET",
    url: "",
  },
  lead: {
    method: "GET",
    url: "",
  },
  answeringMachine: {
    method: "GET",
    url: "",
  },
  hangUpContact: {
    method: "GET",
    url: "",
  },
  inactionContact: {
    method: "GET",
    url: "",
  },
};

const form = reactive({
  ...defaultForm,
  ...props.notifications,
});

const methods = [
  { title: 'GET', value: 'GET' },
  { title: 'POST', value: 'POST' }
]

// Functions
const handleSubmit = () => {
  emit('update:notification', { ...form })
  isOpen.value = false
}

</script>

<template>
  <VDialog
    v-model="isOpen"
    width="768">
    <VCard class="Vertical">
      <VCardTitle>{{ $t('form.labels.notify') }}</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <label>{{ $t('form.Get_Call') }}</label>
            </VCol>
            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <VSelect
                :items="methods"
                v-model="form.no_answer.method"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              class="d-flex align-center"
            >
              <VTextField v-model="form.no_answer.url"/>
            </VCol>
            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <label>{{ $t('form.Get_Action') }}</label>
            </VCol>
            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <VSelect
                :items="methods"
                v-model="form.lead.method"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              class="d-flex align-center"
            >
              <VTextField v-model="form.lead.url"/>
            </VCol>

            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <label>{{ $t('form.Get_AnsweringMachine') }}</label>
            </VCol>
            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <VSelect
                :items="methods"
                v-model="form.answeringMachine.method"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              class="d-flex align-center"
            >
              <VTextField v-model="form.answeringMachine.url"/>
            </VCol>

            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <label>{{ $t('form.Get_HangUpContact') }}</label>
            </VCol>
            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <VSelect
                :items="methods"
                v-model="form.hangUpContact.method"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              class="d-flex align-center"
            >
              <VTextField v-model="form.hangUpContact.url"/>
            </VCol>

            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <label>{{ $t('form.Get_InactionContact') }}</label>
            </VCol>
            <VCol
              cols="12"
              md="3"
              class="d-flex align-center"
            >
              <VSelect
                :items="methods"
                v-model="form.inactionContact.method"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              class="d-flex align-center"
            >
              <VTextField v-model="form.inactionContact.url"/>
            </VCol>
            <VCol>
              <VBtn type="submit">
                {{ $t('actions.save') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
