<template>
  <div>
    <v-btn
      color="text"
      density="comfortable"
      class="notifications"
      variant="text"
      icon
    >

      <div v-if="notifications.count" class="notification-badge bg-primary" :class="notifications.count > 999 ? 'notification-badge-large' : ''">
        <div>{{ calcLength }}</div>
        <span class="bg-primary"></span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
           :style="`fill: ${themeName === 'dark' ? 'white': 'black'}`">
        <path
          d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 0 0 3 16v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 0 0 7 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22z"></path>
      </svg>

      <v-menu activator="parent" v-model="menuOpen">
        <div class="notifications_modal rounded" :style="{background: themeName === 'dark' ? '#323244' : '#fff'}">
<!--          <v-btn v-if="Array.isArray(notifications.entities) && notifications.entities.length > 0" @click.stop.prevent="clearAll"-->
<!--                 variant="outlined" size="small" class="mt-2 ml-3">Очистить всё-->
<!--          </v-btn>-->
          <div v-if="notifications.count ===  0" class="pa-2">{{ $t('notifications.empty') }}</div>
          <div ref="viewBox" class="notifications_modal-view" @scroll="handleScroll">
            <div v-for="notification in notifications.entities" :key="notification.id" class="notifications_modal-item">
              <div class="text-sm" style="opacity: .5;">{{ formatNotificationDate(notification.createdAt) }}</div>
              <div>
                <router-link
                  v-if="notification.data.type === 'check_campaign_limit'"
                  :to="'/campaign/view/' + notification.data.campaignId"
                >
                  {{ getNotificationTextCampaignLimit(notification) }}
                </router-link>
                <router-link
                  v-else-if="notification.data.type === 'check_pending_paused_campaign'"
                  :to="'/campaign/view/' + notification.data.campaignId"
                >
                  <span v-if="notification.data?.attempts === 1">{{ campaignOnPause(notification.data.campaignId, notification.createdAt) }}</span>
                  <span v-else-if="notification.data?.attempts === 2">{{ campaignStoped(notification.data.campaignId, notification.createdAt) }}</span>
                </router-link>

                <div v-else>{{ notification.data.type }}</div>
              </div>
            </div>
          </div>

        </div>
      </v-menu>
    </v-btn>
  </div>
</template>

<script setup>
import {useTheme} from "vuetify";
import {useNotificationStore} from "@/store/notifications";
import {getNotificationTextCampaignLimit} from "@/js/utils/actions/sse/campaignLimit";
import {campaignOnPause, campaignStoped} from "@/js/utils/actions/sse/campaign";

const {
  name: themeName,
} = useTheme()
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notification)

const clearAll = () => {
  notificationStore.clearAll()
}

const menuOpen = ref(false)

const calcLength = computed(() => {
  const count =  notifications.value.count
  if(count > 999 && count <= 4999){
    return '1k+'
  }
  if(count > 4999 && count <= 9999){
    return '5k+'
  }
  if(count > 9999 && count <= 19999){
    return '10k+'
  }
  if(count > 19999){
    return '20k+'
  }
  return count
})
const viewBox = ref(null)

onMounted(() => {
  notificationStore.fetchNotify();
});
onUnmounted(() => {
  if (viewBox.value) {
    viewBox.value.removeEventListener('scroll', handleScroll);
  }
});

const handleScroll = () => {
  const element = viewBox.value;
  if (element) {
    const bottomOfWindow = element.scrollTop + element.clientHeight === element.scrollHeight;
    if (bottomOfWindow) {
      notificationStore.nextFetch();
    }
  }
};

function formatNotificationDate(dateString) {
  if(!dateString) return '';

  const date = new Date(dateString);

  const options = {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'};
  return new Intl.DateTimeFormat('en', options).format(date);
}
</script>

<style lang="scss">
.notifications {
  &_modal {
    padding: 10px;
    width: 350px;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.15);
    max-width: 95vw;
    //background: #000;
    &-view{
      max-height: 90vh;
      overflow-y: auto;
    }
    &-item {
      padding: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.notification-badge {
  position: absolute;
  top: 0px;
  right: -1px;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  font-size: 11px;
  font-weight: bold;


  div {
    position: relative;
    z-index: 6;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    border-radius: 50%;
    animation: animate-pulse 3s ease-in-out infinite;
    height: 20px;
  }

  @keyframes animate-pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: .7;
    }
    20% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
    80% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: .7;
    }
  }

  &-large{
    font-size: 10px;
    width: 22px;
    height: 22px;
    top: -6px;
    right: -5px;
    span{
      width: 25px;
      height: 25px;
    }
  }

}

</style>
