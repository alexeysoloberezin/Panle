<template>
  <!-- Modal for attempts 1 -->
  <v-dialog v-model="showModalFirstAttempt" max-width="600px">
    <v-card>
      <v-card-title class="headline">Неактивная кампания</v-card-title>
      <v-card-text>
        {{ campaignOnPause(campaignNotify.data.campaignId, campaignNotify.createdAt) }}
        Возобновить или Остановить?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="resumeCampaign">
          Возобновить
        </v-btn>
        <v-btn color="red darken-1" text @click="stopCampaign">
          Остановить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal for attempts 2 -->
  <v-dialog v-model="showModalSecondAttempt" max-width="600px">
    <v-card>
      <v-card-title class="headline red--text">Остановлена кампания</v-card-title>
      <v-card-text>
        {{ campaignStoped(campaignNotify.data.campaignId) }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showModalCampaignLimit" max-width="600px">
    <v-card>
      <v-card-title class="headline red--text">Лимит компании закончился</v-card-title>
      <v-card-text>
        <router-link :to="'/campaign/view/' + campaignNotify.data.campaignId" @click="closeModal">
          Лимит кампании {{ campaignNotify.data.campaignId }} достиг {{ campaignNotify.data.limit }} рублей, кампания на
          паузе. Вы можете изменить лимит на кампанию и возобновить кампанию
        </router-link>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref, watch} from 'vue';
import {campaignOnPause, useCampaignNotifyStore, campaignStoped} from "@/js/utils/actions/sse/campaign";
import {startCallCampaign, stopCallCampaign} from "@/composable/campaign/action";

const campaignNotifyStore = useCampaignNotifyStore();
const campaignNotify = computed(() => campaignNotifyStore.campaignNotify)
const showModalFirstAttempt = ref(false);
const showModalSecondAttempt = ref(false);
const showModalCampaignLimit = ref(false)

watch(campaignNotify, (newVal) => {
  if (newVal.data.type === 'check_pending_paused_campaign') {
    if (newVal && newVal.data?.attempts === 1) {
      showModalFirstAttempt.value = true;
    } else if (newVal && newVal.data?.attempts === 2) {
      showModalSecondAttempt.value = true;
    }
  } else if (newVal && newVal.data.type === 'check_campaign_limit') {
    showModalCampaignLimit.value = true
  }
});

const resumeCampaign = async () => {
  await startCallCampaign(campaignNotify.value.data.campaignId);
  showModalFirstAttempt.value = false;
};

const stopCampaign = async () => {
  await stopCallCampaign(campaignNotify.value.data.campaignId);
  showModalFirstAttempt.value = false;
};

const closeModal = () => {
  showModalSecondAttempt.value = false;
  showModalCampaignLimit.value = false;
  showModalFirstAttempt.value = false;
};

</script>
