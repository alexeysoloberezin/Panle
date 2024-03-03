<script setup>
import NewScenario from "@/views/pages/Scenarios/newScenario.vue";
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import {useI18n} from "vue-i18n/dist/vue-i18n";


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
    await router.push({ name: 'scenarios' })
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="$t('data.title.addScenario')">
        <VCardText>
          <NewScenario v-model:value="form" @submit:form="handleSubmit"/>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
