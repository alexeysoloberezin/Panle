<script setup>
import AddContactsModal from "@/views/pages/Contacts/AddContactsModal.vue";
import {useToast} from "vue-toastification";
import AddContactListModal from "@/views/pages/Contacts/AddContactListModal.vue";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";
import {useStatisticsStore} from "@/store/statistics";
import StatisticsListTable from "@/pages/Statistics/StatisticsListTable.vue";
import {CALL_STATUSES_ARRAY} from "@/js/call";
import {useCampaignStore} from "@/store/campaign";
import {todayDates} from "@/js/utils/todayDates";
import StatisticsListTableCampaign from "@/pages/Statistics/StatisticsListTableCampaign.vue";
import {GET_STATUSES_CALL_NAMES_FOR_CAMPAIGNS, GET_STATUSES_SMS_NAMES} from "@/js/statuses";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const toast = useToast()
const route = useRoute();
const router = useRouter();
const statisticsStore = useStatisticsStore()
const storeCampaign = useCampaignStore()
const activeTab = ref('find-calls')

const isOpenAddContactsModal = ref(false)
const isOpenAddContactListModal = ref(false)
const currentList = ref(null)
const todayDefault = true
const loading = ref(false)

const loadStatisticList = async (params) => {
  loading.value = true
  const date = todayDates()
  await statisticsStore.loadStatisticList({date, ...params, type: activeTab.value})
  loading.value = false
}

const changeTab = () => {
  statisticsStore.$reset()
  loadStatisticList({ loadCost: 1 })
}

const statisticList = computed(() => statisticsStore.statisticsList)
const statisticsCount = computed(() => statisticsStore.statisticsCount)
const campaigns = computed(() => storeCampaign.getCampaigns)
const reportLoading = computed(() => statisticsStore.reportLoading)

const perPage = computed(() => statisticsStore.perPage)
const costCalls = computed(() => statisticsStore.costCalls)
const costSms = computed(() => statisticsStore.costSms)

onMounted(async () => {
  await storeCampaign.loadCampaigns()
  await loadStatisticList({loadCost: 1})
})

const handleAddContactsInTable = (list) => {
  isOpenAddContactsModal.value = true
  currentList.value = list;
}

const handleClickContact = (id) => {
  router.push({name: 'contacts-view', params: {id}});
}

const {t} = useI18n()
const statusesItems = CALL_STATUSES_ARRAY(t)
const statusesItemsSms = GET_STATUSES_SMS_NAMES(t)
const statusesItemsCampagin = GET_STATUSES_CALL_NAMES_FOR_CAMPAIGNS(t)
const headers = reactive(tableWrapperDefaultValues().statistics)
const headersSms = reactive(tableWrapperDefaultValues().sms)
const headersCampaign = reactive(tableWrapperDefaultValues().headersCampaign)
const handleCreateReport = async (params) => {
  await statisticsStore.createReport({...params, type: activeTab.value})
}
</script>

<template>
  <VTabs
    v-model="activeTab"
    @update:modelValue="changeTab"
    show-arrows
    class=""
  >
    <VTab
      value="find-calls"
    >
      {{ $t('tabs.calls') }}
    </VTab>
    <VTab
      value="find-sms"
    >
      {{ $t('tabs.sms') }}
    </VTab>
    <VTab
      value="find-campaign"
    >
      {{ $t('tabs.company') }}
    </VTab>
  </VTabs>
  <VDivider/>
  <VWindow
    v-if="Array.isArray(statisticList)"
    v-model="activeTab"
    class="mt-5 disable-tab-transition"
  >
    <VWindowItem value="find-calls">
      <VRow v-if="activeTab === 'find-calls'">
        <VCol cols="12">
          <VCard class="card-visible">
            <TableWrapper :items="statisticList" :lazy-pagination="true"
                          :lazy-options="{ count: statisticsCount, perPage: perPage }"
                          :hide-fields="['sortBy']"
                          :today-default="todayDefault"
                          :show-create-report="true"
                          :info="costCalls"
                          :loading="loading"
                          @update:refreshTable="loadStatisticList"
                          @update:createReport="handleCreateReport"
                          :report-loading="reportLoading"
                          :search-label="$t('form.searchByPhoneAndCompany')"
                          :statuses-items="statusesItems"
                          :headers="headers"
                          :table-name="'statistic'">
              <template #body="{ data }">
                <StatisticsListTable
                  :items="data.items"
                  :headers="data.headers"
                  @click:add-contacts="handleAddContactsInTable"
                  @click:item="handleClickContact"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
    <VWindowItem value="find-campaign">
      <VRow v-if="activeTab === 'find-campaign'">
        <VCol cols="12">
          <VCard class="card-visible">
            <TableWrapper :items="statisticList" :lazy-pagination="true"
                          :lazy-options="{ count: statisticsCount, perPage: perPage }"
                          :today-default="todayDefault"
                          @update:refreshTable="loadStatisticList"
                          @update:createReport="handleCreateReport"
                          @update:liveModeTick="loadStatisticList"
                          :report-loading="reportLoading"
                          :liveMode="true"
                          :loading="loading"
                          :search-label="$t('form.searchByCompany')"
                          :statuses-items="statusesItemsCampagin"
                          :headers="headersCampaign"
                          :table-name="'statistic'">
              <template #body="{ data }">
                <StatisticsListTableCampaign
                  :items="data.items"
                  :headers="data.headers"
                  @click:add-contacts="handleAddContactsInTable"
                  @click:item="handleClickContact"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>

    <!-- Security -->
    <VWindowItem value="find-sms">
      <VRow v-if="activeTab === 'find-sms'">
        <VCol cols="12">
          <VCard>
            <TableWrapper :items="statisticList" :lazy-pagination="true"
                          :lazy-options="{ count: statisticsCount, perPage: perPage }"
                          :hide-fields="['sortBy']"
                          :today-default="todayDefault"
                          :report-loading="reportLoading"
                          :info="costSms"
                          :loading="loading"
                          :show-create-report="true"
                          @update:refreshTable="loadStatisticList"
                          @update:createReport="handleCreateReport"
                          :search-label="$t('form.searchByPhoneAndCompany')"
                          :statuses-items="statusesItemsSms"
                          :headers="headersSms"
                          :table-name="'statistic'">
              <template #body="{ data }">
                <StatisticsListTable
                  :items="data.items"
                  :headers="data.headers"
                  @click:add-contacts="handleAddContactsInTable"
                  @click:item="handleClickContact"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
  </VWindow>
</template>
