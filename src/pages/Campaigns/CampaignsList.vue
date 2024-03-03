<script setup>
import {STATUSES, STATUSES_CALL} from "@/js/statuses";
import {useCampaignStore} from "@/store/campaign";
import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import CampaignTable from "@/views/pages/Campaigns/CampaignTable.vue";
import {useToast} from "vue-toastification";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";
import {
  changeStatus,
  changeStatusOnPromise,
  pauseCallCampaign,
  startCallCampaign,
  stopCallCampaign
} from "@/composable/campaign/action";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.params.tab || 'active')
const storeCampaign = useCampaignStore()
const pagination = computed(() => storeCampaign.pagination)
const loading = computed(() => storeCampaign.loading)

onBeforeMount(() => {
  storeCampaign.$reset()
})

onMounted(async () => {
  await loadCampaigns()
})


const loadCampaigns = async (params = {}) => {
  await storeCampaign.loadCampaigns({...params, status: activeTab.value, statusCall: params?.status})
}

const changeTab = () => {
  storeCampaign.$reset()
  loadCampaigns()
}

const handleClickContact = (id) => {
  router.push({name: 'campaign-view', params: {id}});
}

const campaigns = computed(() => storeCampaign.getCampaignsSorted)
const {t} = useI18n()
const headers = reactive(tableWrapperDefaultValues().headers)

const handlerChangeStatus = async (params) => {
  storeCampaign.loading = true
  await changeStatusOnPromise(params)
  await loadCampaigns()
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle>{{ $t('pages.company') }}</VCardTitle>
          <div
            class="d-flex gap-4 mt-3"
          >
            <RouterLink to="/campaign/new">
              <VBtn type="button">
                {{ $t('actions.add') }}
              </VBtn>
            </RouterLink>
          </div>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>

  <VTabs
    v-model="activeTab"
    show-arrows
    @update:modelValue="changeTab"
    class="mt-10"
  >
    <VTab
      value="active"
    >
      {{ $t('tabs.active') }}
    </VTab>
    <VTab
      value="archive"
    >
      {{ $t('tabs.archive') }}
    </VTab>
  </VTabs>
  <VDivider/>
  <VWindow
    v-if="campaigns"
    v-model="activeTab"
    class="mt-5 disable-tab-transition"
  >
    <!-- Account -->
    <VWindowItem value="active">
      <VRow>
        <VCol cols="12">
          <VCard class="card-visible">
            <TableWrapper
              :items="campaigns"
              :lazy-pagination="true"
              :lazy-options="pagination"
              :loading="loading"
              :status="STATUSES.ACTIVE"
              :show-type-filter="true"
              :headers="headers"
              :table-name="'campaigns'"
              @update:refreshTable="loadCampaigns"
            >
              <template #body="{ data }">
                <CampaignTable
                  :items="data.items"
                  :headers="data.headers"
                  @change:status="handlerChangeStatus"
                  @click:item="handleClickContact"
                  @click:pause-call="pauseCallCampaign"
                  @click:stop-call="stopCallCampaign"
                  @click:start-call="startCallCampaign"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
    <!-- Security -->
    <VWindowItem value="archive">
      <VRow>
        <VCol cols="12">
          <VCard>
            <TableWrapper
              :items="campaigns"
              :lazy-pagination="true"
              :lazy-options="pagination"
              :loading="loading"
              :show-type-filter="true"
              :headers="headers"
              :table-name="'campaigns'"
              :filter-by-keys="['title']">
              <template #body="{ data }">
                <CampaignTable
                  :items="data.items"
                  :headers="data.headers"
                  @change:status="handlerChangeStatus"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
  </VWindow>
</template>
