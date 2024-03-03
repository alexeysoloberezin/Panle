import SSECampaignInstance from "@/js/utils/actions/sse/campaign";
import SSEContactsInstance from "@/js/utils/actions/sse/contacts";
// import SSECampaignLimitInstance from "@/js/utils/actions/sse/campaignLimit";

export const initAllSSE = () => {
  SSECampaignInstance.notificationEventSource()
  SSEContactsInstance.notificationEventSource()
  // SSECampaignLimitInstance.notificationEventSource()
}

export const closeAllSSE = () => {
  SSECampaignInstance.closeEventSource()
  SSEContactsInstance.closeEventSource()
  // SSECampaignLimitInstance.closeEventSource()
}
