<script setup>
import { initToggle } from "@/composable/toggle";
import NewScenario from "@/views/pages/Scenarios/newScenario.vue";
import { useToast } from "vue-toastification";
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import {useI18n} from "vue-i18n/dist/vue-i18n";


const props = defineProps({
  value: {
    type: Boolean
  }
})
const emit = defineEmits(['update:modelValue', 'scenario:created'])
const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})


// Functions
const toast = useToast()
const router = useRouter();
const form = reactive({
  title: '',
  speech_recognition: false,
  audioClip: {},
  ivr_blocks: [],
  ivr_scenarios: [],
})

const {t} = useI18n()
const handleSubmit = async () => {
  const { ivr_blocks, ...data } = form;
  const res = await request.post(endpoints.scenarios.CREATE, data);
  if (res.status === 201) {
    toast.success(t('notifications.scriptCreated'))
    emit('scenario:created', res.data)
    isOpen.value = false;
  }
}
</script>

<template>
  <VDialog
    v-model="isOpen"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <VCard>
      <VToolbar 
        dark
        color="primary"
      >
        <VToolbarTitle>Создание сценария</VToolbarTitle>
        <VSpacer></VSpacer>
        <VToolbarItems>
          <VBtn
            icon
            dark
            @click="isOpen = false"
          >
            <VIcon color="white" icon="mdi-close"></VIcon>
          </VBtn>
        </VToolbarItems>
      </VToolbar>
      <VCol>
        <NewScenario v-model:value="form" @submit:form="handleSubmit"/>
      </VCol>
    </VCard>
  </VDialog>
</template>
