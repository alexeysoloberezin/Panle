<script setup>
import { STATUSES } from "@/js/statuses";
import { useScenariosStore } from "@/store/scenarios";
import ScenariosListTable from "@/views/pages/Scenarios/ScenariosListTable.vue";
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";

const route = useRoute();
const router = useRouter();
const activeTab = ref(route.params.tab || 'active')
const storeScenarios = useScenariosStore()
const pagination = computed(() => storeScenarios.pagination)
const loading = computed(() => storeScenarios.loading)

onMounted(async () => {
  await loadScenarios()
})

// Functions
const loadScenarios = async (params = {}) => {
  await storeScenarios.loadScenarios({...params, status: activeTab.value, statusCall: params?.status});
}

const changeStatus = async ({ id, status }) => {
  const res = await request.post(endpoints.scenarios.CHANGE_STATUS_LIST, { id, status });
  if (res.status === 201) {
    await loadScenarios()
  }
}

const changeTab = () => {
  storeScenarios.$reset()
  loadScenarios()
}

const openItem = (id) => {
  router.push({ name: 'scenarios-view', params: { id } });
}

const scenarios = computed(() => storeScenarios.getScenariosSorted)
const headers = reactive(tableWrapperDefaultValues().headerBase)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard style="overflow: visible">
        <VCardItem>
          <VCardTitle>{{ $t('pages.scenarios') }}</VCardTitle>
          <div
            class="d-flex gap-4 mt-3"
          >
            <RouterLink to="/scenarios/new">
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
    v-if="scenarios"
    v-model="activeTab"
    class="mt-5 disable-tab-transition"
  >
    <!-- Account -->
    <VWindowItem value="active">
      <VRow>
        <VCol cols="12">
          <VCard class="card-visible">
            <TableWrapper
              :items="scenarios"
              :status="STATUSES.ACTIVE"
              :hide-fields="['status']"
              :headers="headers"
              :table-name="'scenarios'"
              :lazy-pagination="true"
              :lazy-options="pagination"
              :loading="loading"
              @update:refreshTable="loadScenarios"
            >
              <template #body="{ data }">
                <ScenariosListTable
                  :items="data.items"
                  :headers="data.headers"
                  @click:item="openItem"
                  @change:status="changeStatus"
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
              :items="scenarios"
              :status="STATUSES.ARCHIVE"
              :hide-fields="['status']"
              :headers="headers"
              :table-name="'scenarios'"
              :lazy-pagination="true"
              :lazy-options="pagination"
              :loading="loading"
              @update:refreshTable="loadScenarios"
            >
              <template #body="{ data }">
                <ScenariosListTable
                  :items="data.items"
                  :headers="data.headers"
                  @change:status="changeStatus"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
  </VWindow>
</template>
