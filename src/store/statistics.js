import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import {useToast} from "vue-toastification";
import {downloadFile} from "@/js/utils/actions/downloadFile";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const toast = useToast()

export const useStatisticsStore = defineStore('statistics', () => {
  const statisticsList = ref(null)
  const statisticsCount = ref(0)
  const perPage = ref(0)
  const host = computed(() => import.meta.env.VITE_HOST)
  const reportLoading = ref(false)
  const {t} = useI18n()

  const costCalls = ref({
    label: t('form.labels.expenses', {el: t('tabs.calls') }),
    value: null
  })
  const costSms = ref({
    label: t('form.labels.expenses', {el: t('tabs.sms') }),
    value: null
  })

  const $reset = () => {
    statisticsList.value = []
    statisticsCount.value = 0
    perPage.value = 0
    reportLoading.value = false
    costCalls.value.value = null
    costSms.value.value = null
  }

  const makeParams = ({page, date, status, text, loadCost = 0}) => {
    let startTime, endTime;

    if (Array.isArray(date)) {
      startTime = date[0].getTime()
      endTime = date[1].getTime()
    }

    return {text, status, startTime, endTime, page, loadCost}
  }

  const createReport = async ({page, date, status, text, type = 'calls', loadCost = 0}) => {
    reportLoading.value = true;
    try {
      const urls = {
        'find-calls': endpoints.statistic.CREATE_RECORD_CALLS,
        'find-sms': endpoints.statistic.CREATE_RECORD_SMS,
        'find-campaign': endpoints.statistic.FIND_CAMPAIGN
      };

      const res = await request({
        method: 'get',
        url: urls[type],
        params: makeParams({page, date, status, text, loadCost})
      });

      if (res.status === 201 || res.status === 200) {
        toast.success(`Отчёт создан`);

        await downloadFile(res.data, host.value)
      }
    } finally {
      reportLoading.value = false;
    }
  }

  const loadStatisticList = async ({page, date, status, text, type = 'find-calls', loadCost = 0} = {}) => {
    const urls = {
      'find-calls': endpoints.statistic.CALLS_LIST,
      'find-sms': endpoints.statistic.SMS_LIST,
      'find-campaign': endpoints.statistic.FIND_CAMPAIGN
    }

    const res = await request({
      method: 'get',
      url: urls[type],
      params: makeParams({page, date, status, text, loadCost})
    });
    if (res.status === 200) {
      statisticsList.value =  res.data.entities
      statisticsCount.value =  res.data.count

      if (res.data?.perPage) {
        perPage.value = res.data.perPage
      } else if (res.data?.offset) {
        perPage.value = res.data.offset
      }

      if (res.data?.costCalls !== undefined && res.data?.costCalls !== null) {
        costCalls.value.value = res.data.costCalls
      }
      if (res.data?.costSms !== undefined && res.data?.costSms !== null) {
        costSms.value.value = res.data.costSms
      }
    }
  }

  return {$reset, loadStatisticList, statisticsList, statisticsCount, perPage, costCalls, costSms, createReport, reportLoading}
})
