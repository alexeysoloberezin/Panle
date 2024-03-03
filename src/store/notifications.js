import {request} from "@/js/utils/actions/request";

export const useNotificationStore = defineStore('notificationStore', () => {
  const notification = ref([])
  const page = ref(1)

  const clearAll = () => {
    notification.value = null
  }

  const getNotifications = () => {
    let res = notification.value
    if(res){
      res = Object.keys(res).map(key => res[key])
      res = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return res || null
  }

  const saveNotifications = (notifications) => {

  }

  const nextFetch = async () => {
    if(notification.value?.count <= notification.value?.offset * page.value){
      return;
    }

    page.value++
    await fetchNotify()
  }

  const fetchNotify = async () => {
    try {
      const res = await request({
        method: 'get',
        url: 'notifications/load',
        params: {
          offset: 10,
          page: page.value,
        }
      })
      if(res.status === 200 && res.data){
        const oldArr = notification.value?.entities || []
        notification.value = {
          count: res.data.count,
          offset: res.data.offset,
          entities: [
            ...oldArr,
            ...res.data.entities.map(el => ({
              ...el,
              data: JSON.parse(el.data) || []
            }))
          ]
        }
      }
    }catch (err){

    }

  }

  return { notification,nextFetch, saveNotifications,page, getNotifications, clearAll, fetchNotify  }
})
