import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { STATUSES_CALL } from "@/js/statuses";
import { useCampaignStore } from "@/store/campaign";
import { useToast } from "vue-toastification";

const toast = useToast();
const storeCampaign = useCampaignStore()

export const startCallCampaign = async (id) => {
    const res = await request.post(endpoints.campaign.START_CALL, { id });
    if (res.status === 201) {
        storeCampaign.getCampaigns[id].statusCall = STATUSES_CALL.LAUNCHED;
        toast.success(`Кампания "${storeCampaign.getCampaigns[id].title}" запущена`)
    }
}

export const pauseCallCampaign = async (id) => {
    const res = await request.post(endpoints.campaign.PAUSE_CALL, { id });
    if (res.status === 201) {
        storeCampaign.getCampaigns[id].statusCall = STATUSES_CALL.PAUSE;
        toast.success(`Кампания "${storeCampaign.getCampaigns[id].title}" поставлена на паузу`)
    }
}
export const stopCallCampaign = async (id) => {
    const res = await request.post(endpoints.campaign.STOP_CALL, { id });
    if (res.status === 201) {
        storeCampaign.getCampaigns[id].statusCall = STATUSES_CALL.NOT_RUNNING;
        toast.success(`Кампания "${storeCampaign.getCampaigns[id].title}" остановлена`)
    }
}

export const changeStatus = async ({ id, status }) => {
    const res = await request.post(endpoints.campaign.CHANGE_STATUS, { id, status });
    if (res.status === 201) {
        await storeCampaign.loadCampaign(id)
    }
}

export const changeStatusOnPromise = async ({id, status}) => {
  const res = await request.post(endpoints.campaign.CHANGE_STATUS, {id, status});
  if (res.status === 201) {
    return Promise.resolve()
  } else {
    return Promise.reject()
  }
}
