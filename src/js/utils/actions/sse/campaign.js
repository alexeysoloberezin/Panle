import { SseClass } from "@/js/utils/actions/sseClass";

export function campaignOnPause (campaignId, createdAt) {
  return `Кампания ${campaignId} на паузе с ${ createdAt ? new Date(createdAt).toLocaleString() : '' }.`
}
export function campaignStoped (campaignId) {
  return `Кампания ${campaignId} была остановлена.`
}

export const useCampaignNotifyStore = defineStore('campaignNotify', () => {
    const campaignNotify = ref(null)

    const setCampaignNotify = (notify) => {
        campaignNotify.value = notify
    }
    // onMounted(() => {
    //   console.log('mounted')
    //   setTimeout(() => {
    //     campaignNotify.value = {
    //       type: "campaign",
    //       createdAt: "2024-02-13T07:16:14.754Z",
    //       status: "warning",
    //       progress: "waiting",
    //       userId: 1,
    //       data: {
    //         campaignId: 68,
    //         limit: 200,
    //         type: 'check_campaign_limit'
    //       }
    //     }
    //   }, 5000)
    // })

    return { campaignNotify, setCampaignNotify }
})

class SSECampaign extends SseClass {
}

const SSECampaignInstance = new SSECampaign('campaign', {
    silent: true,
    cbHandleMessage: (notifications) => {
        console.log('notifications', notifications)
        if (notifications.length) {
            const campaignNotifStore = useCampaignNotifyStore()
            campaignNotifStore.setCampaignNotify(notifications[notifications.length - 1])
        }
    }
})
export default SSECampaignInstance
