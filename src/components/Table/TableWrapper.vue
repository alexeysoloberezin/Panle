<template>
  <div>
    <div v-if="info || showCreateReport || liveMode" class="d-flex align-center">
      <div v-if="info" class="flex-grow-1">
        <v-text-field class="px-3 pt-3" :label="info.label" :model-value="info.value"
                      variant="underlined" :readonly="true" style="pointer-events: none"></v-text-field>
      </div>
      <v-btn
        v-if="showCreateReport"
        class="ml-auto mt-3 mr-3"
        @click="handleCreateReport"
        :loading="reportLoading"
        variant="outlined"
        :disabled="loading"
        size="small"
      >{{ $t('actions.downloadReport') }}
      </v-btn>

      <template v-if="liveMode">
        <v-btn
          class="mt-3 ml-3"
          variant="outlined"
          size="small"
          :disabled="loading"
          @click="fetchData"
        >{{ $t('actions.refresh') }}
        </v-btn>
        <v-checkbox v-model="autoReload" class="ml-3" :label="$t('form.autoRefresh')"></v-checkbox>
      </template>
    </div>
    <v-row v-if="!$vuetify.display.smAndDown" class="pt-3 px-3 align-content-end">
      <TableWrapperFilters
        v-model:search="search"
        v-model:sort-by-selected="sortBySelected"
        v-model:status-call="statusCall"
        v-model:setting-table="settingTable"
        v-model:date="date"
        v-model:type="type"
        :showTypeFilter="showTypeFilter"
        :typeItems="typeItems"
        :hide-fields="hideFields"
        :sort-by="sortBy"
        :today-default="todayDefault"
        :disable="loading"
        :statuses="statuses"
        :headers-items="headersItems"
        :search-label="searchLabel"
        :lazyPagination="lazyPagination"
      />
    </v-row>
    <v-dialog v-else width="500">
      <template v-slot:activator="{ props }">
        <div class="px-4 pt-1 pb-0 d-flex align-end gap-3">
          <div v-if="!hideFields.includes('search')" class="w-100">
            <v-text-field v-model="search" variant="underlined" :label="$t('form.search')" class=""></v-text-field>
          </div>
          <v-btn v-bind="props" class="pa-0 ml-auto" size="small">
            <Icon icon="mdi:filter-menu-outline" style="font-size: 20px"/>
          </v-btn>
        </div>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card title="Dialog">
          <TableWrapperFilters
            v-model:search="search"
            v-model:sort-by-selected="sortBySelected"
            v-model:status-call="statusCall"
            v-model:setting-table="settingTable"
            v-model:date="date"
            v-model:type="type"
            :showTypeFilter="showTypeFilter"
            :typeItems="typeItems"
            :hide-fields="hideFields"
            :sort-by="sortBy"
            :showReset="true"
            :today-default="todayDefault"
            @update:reset="resetFilters"
            :statuses="statuses"
            :headers-items="headersItems"
          />
        </v-card>
      </template>
    </v-dialog>

    <div class="position-relative" style="min-height: 200px">
      <div :style="{ opacity: loading ? 0.5 : 1, pointerEvents:  loading ? 'none' : '' }" style="transition: .3s">
        <slot name="body" :data="{ items: slicedDats, headers: getHeader  }"></slot>
      </div>
      <div v-if="loading" class="my-3 mx-auto text-center position-absolute"
           style="top: 60px; left: 45%; transform: translateX(-50%);z-index: 2">
        <LoaderSpin/>
      </div>
      <div v-else-if="slicedDats.length === 0" class="my-3 mx-auto text-center">
        <h4 class="text-md-h6">{{ $t('data.noData') }}</h4>
      </div>
    </div>


    <v-pagination
      v-model="page"
      :total-visible="7"
      :length="totalPages"
      :disabled="loading"
      class="mt-2 mb-3"
      rounded="circle"
    ></v-pagination>
  </div>
</template>

<script setup>
/**
 * @typedef {Object} Props
 * @property {number} maxItems - Максимальное количество элементов.
 * @property {Array} items - Элементы для отображения.
 * @property {Array} filterByKeys - Ключи для фильтрации.
 * @property {Array} headers - Заголовки таблицы.
 * @property {string} tableName - Название таблицы.
 * @property {boolean} lazyPagination - true пагинация через бек.
 * @property {Object} lazyOptions - { perPage: кол вид элементов (из запроса), count: number (кол элементов ) }
 * @property {Array} hideFields - Скрыть поля сортировки/фильтрации. ['search', 'date', 'status', 'sortBy', 'fieldsTable']
 */
import { Icon } from '@iconify/vue';
import { getStatusesCall } from "@/js/statuses";
import useLocalStorage from "@/composable/useLocalstorage";
import TableWrapperFilters from "@/components/Table/TableWrapperFilters.vue";
import { CALL_STATUSES, CALL_STATUSES_ARRAY } from "@/js/call";
import { todayDates } from "@/js/utils/todayDates";
import { onBeforeUnmount } from "vue";
import LoaderSpin from "@/components/LoaderSpin.vue";
import { useI18n } from "vue-i18n/dist/vue-i18n";
import { tableWrapperDefaultValues } from "@/components/Table/TableWrapperDefaultValues";

const props = defineProps(['maxItems', 'status', 'sortBy', 'showTypeFilter', 'typeItems', 'loading', 'liveMode', 'info', 'reportLoading', 'showCreateReport', 'statusesItems', 'todayDefault', 'items', 'searchLabel', 'filterByKeys', 'headers', 'tableName', 'hideFields', 'lazyPagination', 'lazyOptions'])
const emit = defineEmits(['update:refreshTable', 'update:liveModeTick'])

const { t } = useI18n()


const searchLabel = props?.searchLabel || t('form.search')

const defaultData = {
  date: props?.todayDefault ? todayDates() : null,
  statusCall: null,
  search: '',
  sortBySelected: 'createdAt'
}

const hideFields = ref(props.hideFields || []);
const date = ref(defaultData.date)
const lazyPagination = props?.lazyPagination
const headers = ref(props.headers || tableWrapperDefaultValues.headers)
const page = ref(1)
const callStatusesItems = CALL_STATUSES_ARRAY()

const typeItems = props?.typeItems || [{
  name: t('form.createdBy.all'),
  key: 'all'
}, { name: t('form.createdBy.client'), key: 'default' }, { name: t('form.createdBy.api'), key: 'api' }]
const type = ref(typeItems[0].key)


const maxItems = ref(props.maxItems || 10)
const search = ref(defaultData.search);
const statuses = props?.statusesItems || getStatusesCall()
const statusCall = ref(defaultData.statusCall);

const getParamsForSend = (loadCost = 0) => {
  return {
    text: search.value,
    sortBySelected: sortBySelected.value,
    status: statusCall.value,
    settingTable: settingTable.value,
    date: date.value,
    type: type.value,
    page: page.value,
    loadCost
  }
}

onBeforeMount(() => {
  if (!props.tableName) throw 'Table name is required';
  if (props.items === undefined) throw 'Table Items is required in :: ' + props.tableName;

  if (props?.liveMode) {
    startRealtimeUpdates()
  }
})

const { value: settingTable } = useLocalStorage(props.tableName + '-fields',
  headers.value
    .filter(el => !el?.initialHide && !el?.permanentHide)
    .map(el => el.key)
)


const headersItems = headers.value.filter(el => !el?.permanentHide)

const getHeader = computed(() => {
  return headers.value.filter(head => settingTable.value.some(el => el.includes(head.key)))
})

const realData = computed(() => {
  let res = props.items
  if (typeof props.items === 'object') {
    res = Object.values(props.items)
  }
  return res
})

const filterByKeys = ref(props.filterByKeys || ['title', 'id'])

const filteredData = computed(() => {
  let sortedData = realData.value

  if (lazyPagination) {
    return sortedData
  }

  const searchText = search.value.toLowerCase();
  const selectedKey = sortBySelected.value;

  if (type.value && type.value !== 'all') {
    sortedData = sortedData.filter(el => el.type === type.value)
  }

  if (props.status) {
    sortedData = sortedData.filter(el => el.status === props.status)
  }

  if (statusCall.value) {
    sortedData = sortedData.filter(el => el?.statusCall === statusCall.value)
  }

  if (date.value) {
    const startDate = new Date(date.value[0]);
    const endDate = new Date(date.value[1]);

    sortedData = sortedData.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  sortedData = sortedData
    .filter(item => {
      return filterByKeys.value.some(key => {
        const value = item[key];
        if (value || value === '') {
          return value.toString().toLowerCase().includes(searchText);
        }
        return false;
      });
    })
    .sort((a, b) => {
      let comparison = 0;

      if (selectedKey === 'id') {
        comparison = a.id - b.id;
      } else if (selectedKey === 'createdAt' || selectedKey === 'createdAt_reverse') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        comparison = dateB - dateA;
      } else if (selectedKey === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (selectedKey === 'contactsCount') {
        comparison = b.contactsCount - a.contactsCount;
      }

      return comparison;
    });

  return sortedData;
});

const slicedDats = computed(() => {
  if (lazyPagination) {
    return filteredData.value
  }

  const start = (page.value - 1) * maxItems.value;
  const end = start + maxItems.value;
  return filteredData.value.slice(start, end)
})

const totalPages = computed(() => {
  if (lazyPagination) {
    return Math.ceil(+props.lazyOptions.count / +props.lazyOptions.perPage) || 1
  } else {
    return Math.ceil(filteredData.value.length / maxItems.value) || 1
  }
});

watch(
  [page],
  () => {
    if (page.value > totalPages.value) {
      page.value = totalPages.value;
    }
    emit('update:refreshTable', getParamsForSend());
  }
);

const sortBySelected = ref(defaultData.sortBySelected)
const propsSortBy = props.sortBy || []
const sortBy = reactive([
  {
    name: t('form.sortByList.date'),
    key: 'createdAt',
  }, {
    name: t('form.sortByList.name'),
    key: 'title',
  },
  ...propsSortBy,
])


const resetFilters = () => {
  search.value = defaultData.search
  sortBySelected.value = defaultData.sortBySelected
  statusCall.value = defaultData.statusCall
  date.value = defaultData.date
}

watch(
  [search, sortBySelected, statusCall, settingTable, date, type],
  () => {
    page.value = 1
    emit('update:refreshTable', getParamsForSend(1));
  },
);

const handleCreateReport = async () => {
  emit('update:createReport', getParamsForSend(1))
}

const autoReload = ref(true)
let intervalId;

const fetchData = () => {
  emit('update:liveModeTick', getParamsForSend())
}

const startRealtimeUpdates = () => {
  intervalId = setInterval(() => {
    if (autoReload.value) {
      fetchData()
    }
  }, 10000);
};

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style lang="scss">
</style>
