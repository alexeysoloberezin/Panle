<script setup>
import { useToast } from "vue-toastification";
import { useScenariosStore } from "@/store/scenarios";
import NewScenario from "@/views/pages/Scenarios/newScenario.vue";
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const props = defineProps(['scenarios_id'])
const emit = defineEmits(['update:save'])

const toast = useToast()
const route = useRoute();
const router = useRouter();
const storeScenarios = useScenariosStore()
const scenario = ref(null)
const isLoading = ref(true)

const scenarios_id  = props?.scenarios_id || route.params.id
const isModal = !!props?.scenarios_id

onMounted(async () => {
  await loadList();
})

const loadList = async () => {
  try {
    await storeScenarios.loadList(scenarios_id);
    scenario.value = storeScenarios.getScenarios[scenarios_id];
    scenario.value.ivr_blocks = [];
  } catch (error) {
    if (error?.status === 404) {
      router.push({ name: 'scenarios' })
    }
  } finally {
    isLoading.value = false
  }
}

const {t} = useI18n()
const handleSubmitCreateScenario = async () => {
  const { ivr_blocks, ...data } = scenario.value;
  data.ivr_scenarios = data.ivr_scenarios.map((item, index) => {
    const newData = { ...scenario.value.ivr_scenarios[index] };
    scenario.value.ivr_scenarios[index] = item;
    return newData;
  })
  const res = await request.post(endpoints.scenarios.EDIT, data);
  if (res.status === 201) {
    toast.success(t('notifications.scriptSaved'))
    if(isModal){
      emit('update:save')
    }else{
      await router.push({ name: 'scenarios' })
    }
  }
}

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem v-if="scenario">
          <VCardTitle class="mb-5">Сценарий - {{ scenario?.title }}
          </VCardTitle>
          <div class="d-flex justify-space-between flex-wrap">
          </div>
          <VCardText class="px-0">
            <NewScenario v-if="scenario.id" v-model:value="scenario" @submit:form="handleSubmitCreateScenario"/>
          </VCardText>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>
</template>
