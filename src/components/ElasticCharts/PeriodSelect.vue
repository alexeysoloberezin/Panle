<template>
  <v-select v-if="period !== 'custom'" :items="periodItems" v-model="period" item-value="key" :clearable="true"
            item-title="name" label="Период" variant="underlined" class="mt-0"></v-select>
  <div v-else class="d-flex align-end">
    <VueDatePicker v-model="date" :start-time="[{hours: 0, minutes: 0}, {hours: 23, minutes: 59}]" range
                   class="mt-4"></VueDatePicker>
    <v-btn @click="period = null;date= null" size="x-small" class="ml-1" variant="outlined">Вернуть</v-btn>
  </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps(['date', 'hideFields', 'period', 'callStatusesItems', 'searchLabel', 'lazyPagination', 'showReset', 'settingTable', 'headersItems', 'statusCall', 'statuses', 'sortBy', 'sortBySelected', 'search'])
const emit = defineEmits(['update:date', 'update:period', 'update:reset', 'update:search', 'update:sortBySelected', 'update:statusCall', 'update:settingTable'])

const periodItems = [
  {
    key: 'custom',
    name: 'Произвольный период'
  },
  {
    key: 'today',
    name: 'За сегодня'
  },
  {
    key: 'lastHour',
    name: 'За последний час',
  },
  {
    key: 'last30Minutes',
    name: 'За последние 30 минут',
  },
  {
    key: 'yesterday',
    name: 'За вчера'
  },
  {
    key: 'last7days',
    name: 'За последние 7 дней'
  },
  {
    key: 'thisWeek',
    name: 'За эту неделю'
  },
  {
    key: 'weekBefore',
    name: 'За прошлую неделю'
  },
  {
    key: 'last30days',
    name: 'За последние 30 дней'
  },
  {
    key: 'thisMonth',
    name: 'За этот месяц'
  },
  {
    key: 'monthBefore',
    name: 'За прошлый месяц'
  },
  {
    key: 'last90days',
    name: 'За последние 90 дней'
  },
  {
    key: 'thisYear',
    name: 'За текущий год'
  },

]

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

const period = computed({
  get() {
    return props.period
  },
  set(newPeriod) {
    if (newPeriod === null) {
      date.value = null
      emit('update:period', newPeriod);
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
      } else if (newPeriod === 'lastHour') {
        startDate = new Date(currentDate);
        startDate.setHours(currentDate.getHours() - 1);
        endDate = currentDate;
      } else if (newPeriod === 'last30Minutes') {
        startDate = new Date(currentDate);
        startDate.setMinutes(currentDate.getMinutes() - 30);
        endDate = currentDate;
      } else if (newPeriod === 'today') {
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
        emit('update:period', newPeriod);
        return null
      }
      emit('update:date', [startDate, endDate]);
    }
    emit('update:period', newPeriod);
  }
})


</script>

<style scoped>

</style>
