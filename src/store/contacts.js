import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import {useToast} from "vue-toastification";
import {preventMultipleUse} from "@/js/utils/helpers";
import makeDateParams from "@/js/utils/makeDateParams";

const toast = useToast()

export const useContactsStore = defineStore('contacts', () => {
  const contactsList = ref({})
  const orderList = ref([])
  const pagination = ref({
    count: 0,
    perPage: 0
  })
  const loading = ref(false)

  const viewList = ref({
    loading: false,
    perPage: 0,
    count: 0,
    entities: []
  })

  const setList = (list) => {
    if (list?.id) {
      contactsList.value[list.id] = list;
    }
  }
  const setLogs = (id, logs) => {
    contactsList.value[id].callsListLog = logs;
  }

  const setContactsList = ({entities, count, offset} = {
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
    for (const list of entities) {
      setList(list);
    }
  }

  const getContactsList = computed(() => {
    return contactsList.value;
  })

  const getContactsListSorted = computed(() => {
      return orderList.value.map(el => contactsList.value[el])
  })

  const loadContactsList = async (
    {text, sortBySelected, status, date, page, type} = {
      text: '',
      type: '',
      sortBySelected: '',
      status: '',
      date: [],
      page: 1
    }
  ) => {
    await preventMultipleUse(loadContactsList, async () => {
      loading.value = true

      try {
        const res = await request({
          method: 'get',
          url: endpoints.contacts.LOAD_LISTS,
          params: makeDateParams({
            page,
            date,
            type: type !== 'all' ? type : '',
            status,
            title: text,
            order: sortBySelected,
          })
        });

        if (res.status === 200) {
          await setContactsList(res.data)
        }
      } catch (err) {
      } finally {
        loading.value = false
      }
    })
  }

  const loadList = async (id) => {
    await preventMultipleUse(loadList, async () => {
      const res = await request.get(endpoints.contacts.VIEW_LIST(id));
      if (res.status === 200) {
        await setList(res.data)
      }
    })
  }
  const loadLogs = async (id) => {
    const res = await request.get(endpoints.contacts.VIEW_LOGS(id));
    if (res.status === 200) {

      await setLogs(id, res.data)
    }
  }

  const loadListById = async ({id, params} = {id: 0, params: {page: 1}}) => {
    viewList.value = {
      entities: [],
      count: 0,
      perPage: 0,
      loading: true
    }

    try {
      const res = await request({
        method: 'get',
        url: endpoints.contacts.LOAD_LIST(id),
        params: {page: params?.page, text: params?.text}
      })

      if (res.status === 200) {
        viewList.value = {
          ...res.data,
          perPage: res.data.offset
        }
      }
    } catch (err) {
    } finally {
      viewList.value.loading = false
    }
  }

  const $reset = () => {
    orderList.value = []
    contactsList.value = {}
    pagination.value = {
      count: 0,
      perPage: 0
    }
  }

  return {
    contactsList,
    setContactsList,
    orderList,
    loadListById,
    $reset, pagination, loading,
    getContactsList,
    getContactsListSorted,
    loadContactsList,
    viewList,
    loadList,
    loadLogs
  }
})
