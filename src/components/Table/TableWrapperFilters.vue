<template>
<!--  {{ callStatusesItems }}-->
  <v-col v-if="!hideFields.includes('search')">
    <v-text-field
      v-model="searchVal"
      variant="underlined"
      :disabled="disable"
      @input="onSearchInput"
      :label="searchLabel"
      class="mb-2"
    ></v-text-field>
  </v-col>
  <v-col v-if="showTypeFilter">
    <v-select
      v-model="type"
      :items="typeItems"
      :disabled="disable"
      variant="underlined"
      :label="$t('form.created')"
      item-title="name"
      item-value="key"
    />
  </v-col>
<!--  <v-col v-if="Array.isArray(callStatusesItems)">-->
<!--    <v-select-->
<!--      v-model="sortBySelected"-->
<!--      :items="callStatusesItems"-->
<!--      variant="underlined"-->
<!--      label="Статус"-->
<!--      item-title="name"-->
<!--      item-value="key"-->
<!--    />-->
<!--  </v-col>-->
  <v-col v-if="!hideFields.includes('sortBy')">
    <v-select
      v-model="sortBySelected"
      :items="sortBy"
      :disabled="disable"
      variant="underlined"
      :label="$t('form.sortBy')"
      item-title="name"
      item-value="key"
    />
  </v-col>
  <v-col v-if="!hideFields.includes('status')">
    <v-select
      v-model="statusCall"
      :items="statuses"
      :disabled="disable"
      :clearable="true"
      variant="underlined"
      :label="$t('form.status')"
      item-title="name_ru"
      item-value="key"
    />
  </v-col>
  <v-col v-if="!hideFields.includes('date')">
    <v-select v-if="period !== 'custom'" :items="periodItems" :disabled="disable" v-model="period" item-value="key" :clearable="true"
              item-title="name" :label="$t('form.period')" variant="underlined"></v-select>
    <div v-else class="d-flex align-end">
      <VueDatePicker v-model="date" :start-time="[{hours: 0, minutes: 0}, {hours: 23, minutes: 59}]" range
                     class="mt-4"></VueDatePicker>
      <v-btn @click="period = null;date= null" size="x-small" class="ml-1" variant="outlined">Вернуть</v-btn>
    </div>
  </v-col>
  <v-col v-if="!hideFields.includes('fieldsTable')">
    <v-select
      v-model="settingTable"
      variant="underlined"
      :disabled="disable"
      :items="headersItems"
      item-value="key"
      item-title="name"
      :label="$t('form.tableFields')"
      multiple
    >
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 1" size="x-small">
          <span>{{ item.title }}</span>
        </v-chip>
        <span
          v-if="index === 1"
          class="text-grey text-caption align-self-center"
        >
            (+{{ settingTable.length - 1 }})
            </span>
      </template>
    </v-select>
  </v-col>

  <v-col v-if="showReset">
    <v-btn v-bind="props" :disabled="disable" @click="emit('update:reset')" class="ml-auto" variant="outlined" size="small">
      Сбросить фильтры
    </v-btn>
  </v-col>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {useI18n} from "vue-i18n/dist/vue-i18n";

const props = defineProps(['date','showTypeFilter','disable','type','typeItems', 'hideFields','todayDefault','callStatusesItems', 'searchLabel','lazyPagination', 'showReset', 'settingTable', 'headersItems', 'statusCall', 'statuses', 'sortBy', 'sortBySelected', 'search'])
const emit = defineEmits(['update:date', 'update:type','update:reset', 'update:search', 'update:sortBySelected', 'update:statusCall', 'update:settingTable'])

const period = ref(props?.todayDefault ? 'today' : null)
const {messages, locale} = useI18n()

const periodItems = computed(() => {
  if(!messages.value || !locale.value){
    return []
  }

  const periodList = messages.value[locale.value].periodList

  if(!periodList) { return [] }

  return Object.keys(periodList).map(key => ({
    key,
    name: periodList[key]
  }))
})

const date = computed({
  get() {
    return props.date
  },
  set(value) {
    if (!value) return emit('update:date', null);

    let [date1, date2] = value
    if (date2 === null) {
      date2 = new Date(date1);
      date2.setHours(23, 59, 0, 0);
    }
    emit('update:date', [date1, date2])
  }
})
watch(period, (newPeriod) => {
  if (newPeriod === null) {
    date.value = null
    return null
  }
  if (newPeriod) {
    const currentDate = new Date();
    let startDate, endDate;

    if (newPeriod === 'yesterday') {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0); // Устанавливаем начальное время в 00:00
      const endOfYesterday = new Date(currentDate);
      endOfYesterday.setDate(currentDate.getDate() - 1);
      endOfYesterday.setHours(23, 59, 59, 0); // Устанавливаем конечное время в 23:59
      startDate = yesterday;
      endDate = endOfYesterday;
    }else if (newPeriod === 'today') {
      const today = new Date(currentDate);
      today.setHours(0, 0, 0, 0); // Устанавливаем начальное время в 00:00
      const endOfToday = new Date(currentDate);
      endOfToday.setHours(23, 59, 59, 0); // Устанавливаем конечное время в 23:59
      startDate = today;
      endDate = endOfToday;
    } else if (newPeriod === 'last7days') {
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
      const today = new Date(currentDate);
      startDate = sevenDaysAgo;
      endDate = today;
    } else if (newPeriod === 'thisWeek') {
      const dayOfWeek = currentDate.getDay(); // 0 (воскресенье) - 6 (суббота)

      // Устанавливаем начальное время в 00:00 понедельника текущей недели
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Если текущий день - воскресенье, то начало недели устанавливаем на понедельник

      // Устанавливаем конечное время в 23:59 воскресенья текущей недели
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
      endDate.setHours(23, 59, 0, 0);
    } else if (newPeriod === 'weekBefore') {
      const dayOfWeek = currentDate.getDay(); // 0 (воскресенье) - 6 (суббота)
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0); // Устанавливаем начальное время в 00:00
      startDate.setDate(currentDate.getDate() - dayOfWeek - 7);
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() - dayOfWeek - 1);
      endDate.setHours(23, 59, 0, 0);
    } else if (newPeriod === 'last30days') {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0); // Устанавливаем начальное время в 00:00
      startDate.setDate(currentDate.getDate() - 30);
      endDate = new Date(currentDate);
      endDate.setHours(23, 59, 0, 0);
    } else if (newPeriod === 'thisMonth') {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      startDate = firstDayOfMonth;
      endDate = lastDayOfMonth;
      endDate.setHours(23, 59, 0, 0);
    } else if (newPeriod === 'monthBefore') {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      startDate = firstDayOfMonth;
      endDate = lastDayOfMonth;
      endDate.setHours(23, 59, 0, 0);
    } else if (newPeriod === 'last90days') {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0); // Устанавливаем начальное время в 00:00
      startDate.setDate(currentDate.getDate() - 90);
      endDate = new Date(currentDate);
      endDate.setHours(23, 59, 0, 0);
    } else if (newPeriod === 'thisYear') {
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);
      startDate = firstDayOfYear;
      endDate = lastDayOfYear;
      endDate.setHours(23, 59, 0, 0);
    } else if (newPeriod === 'custom') {
      // Ничего не делаем, пользователь должен вручную выбрать даты
      return null
    }
    emit('update:date', [startDate, endDate]);
  }
});

const searchVal = ref(props.search);
const searchTimer = ref(null);
const onSearchInput = () => {
  if (props.lazyPagination) {
    clearTimeout(searchTimer.value);
    searchTimer.value = setTimeout(() => {
      // Выполняем поиск только после задержки
      emit('update:search', searchVal.value);
    }, 1000);
  } else {
    // Если не используется ленивая загрузка, обновляем сразу
    emit('update:search', searchVal.value);
  }
};


const sortBySelected = computed({
  get() {
    return props.sortBySelected
  },
  set(value) {
    emit('update:sortBySelected', value)
  }
})

const statusCall = computed({
  get() {
    return props.statusCall
  },
  set(value) {
    emit('update:statusCall', value)
  }
})
const type = computed({
  get() {
    return props.type
  },
  set(value) {
    emit('update:type', value)
  }
})

const settingTable = computed({
  get() {
    return props.settingTable
  },
  set(value) {
    emit('update:settingTable', value)
  }
})
</script>

<style scoped>

</style>
