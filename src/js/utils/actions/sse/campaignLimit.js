import {SseClass} from "@/js/utils/actions/sseClass";

export const getNotificationTextCampaignLimit = (notification) => {
  return `Лимит кампании ${notification.data.campaignId } ${ notification.data.campaignTitle } достиг ${ notification.data.limit } рублей, кампания на паузе. Вы можете изменить лимит на кампанию и возобновить кампанию`
}

// class SSECampaignLimit extends SseClass{}
//
// const SSECampaignLimitInstance = new SSECampaignLimit('check_campaign_limit', {
//   templateMessage: (notification) => getNotificationTextCampaignLimit(notification)
// })
// export default SSECampaignLimitInstance
