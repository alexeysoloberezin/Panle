<script setup>
import NewCampaign from "@/views/pages/Campaigns/newCampaign.vue";
import {useCampaignStore} from "@/store/campaign";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const storeCampaign = useCampaignStore()
const route = useRoute()
const campaignId = computed(() => route.params.id ?? null)
const campaigns = ref(null)
const isLoading = ref(false)

onMounted( () => {
  if(campaignId.value){
    loadCampaign()
  }
})

const loadCampaign = async () => {
  isLoading.value = true
  try {
    await storeCampaign.loadCampaign(route.params.id);
    const res = storeCampaign.getCampaigns[route.params.id]
    campaigns.value = {
      ...res,
      scenario: res.scenario?.id || null,
      contactsList: res.contactsList?.id || null
    };
  } catch (error) {
    if (error?.status === 404) {
      router.push({ name: 'campaign' })
    }
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  storeCampaign.$patch({
    campaign: {}
  })
})

const {t} = useI18n()
const title = computed(() => {
  if(isLoading.value) return t('data.loading');
  if(campaigns.value) return t('campaigns.change', {name: campaigns.value?.title});
  return t('campaigns.create')
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard :title="title">
        <VCardText>
          <NewCampaign
            :key="campaigns"
            :campaign="campaigns"
            :campaign-id="campaignId"
            :isLoading="isLoading"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
