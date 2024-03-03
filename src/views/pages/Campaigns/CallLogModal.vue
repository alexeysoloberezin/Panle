<script setup>
import {useToast} from "vue-toastification";
import {initToggle} from "@/composable/toggle";
import {dateToString} from "@/js/utils/ui/dateString";
import {VDataTableVirtual} from "vuetify/labs/VDataTable";
import {CALL_ACTION, CALL_COMPLETED, CALL_DIRECTION, CALL_STATUSES} from "@/js/call";
import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import {downloadFile} from "@/js/utils/actions/downloadFile";
import {useCampaignStore} from "@/store/campaign";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";
import TableWrapper from "@/components/Table/TableWrapper.vue";

const toast = useToast()
const router = useRouter()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  value: {
    type: Boolean
  },
  item: {
    type: Object
  },
  campaign: {
    type: Object
  }
})
const campaignStore = useCampaignStore()
const logList = computed(() => campaignStore.getLogList)
const loading = computed(() => campaignStore.logList.loading)
const perPage = computed(() => campaignStore.logList.perPage)
const count = computed(() => campaignStore.logList.count)

const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})

const headers = [
  {title: 'ID', key: 'id', align: 'start', sortable: false},
  {title: 'Номер', key: 'phone', align: 'center', sortable: false},
  {title: 'Статус', key: 'text_status', align: 'center', sortable: false},
  {title: 'Действие', key: 'text_action', align: 'center', sortable: false},
  {title: 'Кто положил трубку', key: 'text_who_completed_call', align: 'center', sortable: false},
  {title: 'Длительность разговора', key: 'duration', align: 'center', sortable: false},
  {title: 'Попытка', key: 'attempt', align: 'center', sortable: false},
  {title: 'Направление', key: 'text_direction', align: 'center', sortable: false},
  {title: 'Caller ID', key: 'callerID', align: 'center', sortable: false},
]

let timer = null;
const wrapperTable = ref(null);
const height = ref(0)
let callsLogList = null;
let report_filename = ref(null);
const loadingReport = ref(false);
const host = computed(() => import.meta.env.VITE_HOST)

// Functions

watch(wrapperTable, () => {
  height.value = wrapperTable.value?.offsetHeight
})

onMounted(() => {
  if (props.item.id) {
    campaignStore.loadLog({
      id: props.item.id,
      params: {
        page: 1,
      }
    })
  }
})

onBeforeUnmount(() => {
  campaignStore.$reset_logList()
})

const loadLogWithParams = (params) => {
  campaignStore.loadLog({
    id: props.item.id,
    params
  })
}

watch(() => props.item, () => {
  callsLogList = props.item?.callsLog?.map(item => ({
    ...item,
    text_status: CALL_STATUSES[item.status],
    text_action: CALL_ACTION[item.action],
    text_direction: CALL_DIRECTION[item.direction],
    text_who_completed_call: CALL_COMPLETED[item.who_completed_call]
  }));
  report_filename.value = props.item.report_filename;
})

const handleCreateReport = async () => {
  loadingReport.value = true

  const res = await request.post(endpoints.campaign.CREATE_REPORT(props.item.id));
  if (res.status === 201) {
    await downloadFile(res.data, host.value, 'xlsx', {title: props?.campaign.title, date: props?.campaign.updatedAt})
  }

  loadingReport.value = false
}

</script>

<template>
  <VDialog
    v-model="isOpen"
    fullscreen
  >
    <VCard>
      <VToolbar
        dark
        color="primary"
      >
        <VToolbarTitle>
          {{ dateToString(item.createdAt) }}
        </VToolbarTitle>
        <VBtn
          class="ml-4"
          variant="outlined"
          color="white"
          :loading="loadingReport"
          @click="handleCreateReport"
        >Скачать отчёт
        </VBtn>
        <VBtn
          icon
          @click="isOpen = false"
        >
          <VIcon color="white" icon="mdi-close"/>
        </VBtn>
      </VToolbar>

      <div ref="wrapperTable" class="flex-1-0 mt-3">
        <TableWrapper
          v-if="Array.isArray(logList?.entities) && logList?.entities"
          :items="logList?.entities"
          :lazy-pagination="true"
          :lazy-options="{ perPage, count }"
          :hide-fields="[ 'date', 'status', 'sortBy', 'fieldsTable']"
          :search-label="'Введите номер для поиска'"
          :loading="loading"
          @update:refreshTable="loadLogWithParams"
          :headers="headers"
          :table-name="'LogModal'"
        >
          <template #body="{ data }">
            <VDataTableVirtual
              :items="data.items"
              :headers="data.headers"
              item-value="id"
              fixed-header
            />
          </template>
        </TableWrapper>
      </div>
    </VCard>
  </VDialog>
</template>
