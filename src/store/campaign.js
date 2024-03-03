import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import {campaign} from "@/js/utils/actions/endpoints/campaign";
import makeDateParams from "@/js/utils/makeDateParams";
import {CALL_ACTION, CALL_COMPLETED, CALL_DIRECTION, CALL_STATUSES} from "@/js/call";

export const useCampaignStore = defineStore('campaign', () => {
  const campaign = ref({})
  const orderList = ref([])
  const pagination = ref({
    count: 0,
    perPage: 0
  })
  const loading = ref(false)
  const campaignIds = ref({})
  const logList = ref({
    loading: false,
    perPage: 0,
    count: 0,
    entities: []
  })

  const setCampaign = (item) => {
    if (item?.id) {
      campaign.value[item.id] = item;
    }
  }

  const setLogs = (id, logs) => {
    campaign.value[id].callsListLog = logs;
  }

  const setCampaigns = ({entities, count, offset} = {
    entities: [],
    offset: 0,
    count: 0
  }) => {
    $reset();

    pagination.value = {
      count,
      perPage: offset
    }

    orderList.value = entities.map(item => item.id)

    entities.forEach(item => {
      campaign.value[item.id] = item
      campaignIds.value[`${item.id}`] = item.title
    })
  }

  const getCampaignsForEdit = computed(() => {
    return {
      ...campaign.value,
      scenario: campaign.value?.scenario?.id
    };
  })

  const getCampaigns = computed(() => {
    return campaign.value;
  })

  const getCampaignsSorted = computed(() => {
    return orderList.value.map(el => campaign.value[el])
  })

  const loadCampaigns = async (
    {text, sortBySelected, status, type, statusCall, date, page}
      = {text: '', sortBySelected: '', status: '', type: '', statusCall: '', date: [], page: 1}
  ) => {
    campaignIds.value = {}
    loading.value = true

    const res = await request({
      method: 'get',
      url: endpoints.campaign.LOAD_CAMPAIGNS,
      params: makeDateParams({page, date, status, title: text,statusCall, order: sortBySelected, type: type !== 'all' ? type : ''})
    });

    if (res.status === 200) {
      setCampaigns(res.data)
    }

    loading.value = false
  }

  const loadCampaign = async (id) => {
    const res = await request.get(endpoints.campaign.VIEW_LIST(id));
    if (res.status === 200) {
      await setCampaign(res.data)
    }
  }

  const loadLogs = async (id) => {
    const res = await request.get(endpoints.campaign.VIEW_LOGS(id));
    if (res.status === 200) {
      await setLogs(id, res.data)
    }
  }

  const loadLog = async ({id, params} = {id: 0, params: {page: 1}}) => {
    logList.value = {
      entities: [],
      count: 0,
      perPage: 0,
      loading: true
    }

    try {
      const res = await request({
        method: 'get',
        url: endpoints.campaign.LOAD_LOGS(id),
        params: {page: params?.page, text: params?.text}
      })

      if (res.status === 200) {
        logList.value = {
          ...res.data,
          perPage: res.data.offset
        }
      }
    }catch (err){
    }finally {
      logList.value.loading = false
    }
  }

  const getLogList = computed(() => {
    return {
      ...logList.value,
      entities: logList.value?.entities?.map(item => ({
        ...item,
        text_status: CALL_STATUSES[item.status],
        text_action: CALL_ACTION[item.action],
        text_direction: CALL_DIRECTION[item.direction],
        text_who_completed_call: CALL_COMPLETED[item?.who_completed_call]
      }))
    };
  })

  const $reset_logList = () => {
    logList.value = {
      entities: [],
      count: 0,
      perPage: 0,
      loading: false
    }
  }

  const $reset = () => {
    campaign.value = {}
    orderList.value = []
    pagination.value = {
      count: 0,
      perPage: 0
    }
    campaignIds.value = {}
  }

  return {
    campaign,
    setCampaigns,
    orderList,
    getCampaignsSorted,
    pagination,
    getCampaigns,
    getCampaignsForEdit,
    campaignIds,
    loading,
    $reset,
    $reset_logList,
    loadLog,
    getLogList,
    logList,
    loadCampaigns,
    loadCampaign,
    loadLogs,
    setLogs
  }
})
