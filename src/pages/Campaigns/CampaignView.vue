<script setup>
import { useToast } from "vue-toastification";
import { useCampaignStore } from "@/store/campaign";
import CampaignListLogModal from "@/views/pages/Campaigns/CampaignListLogModal.vue";
import { dateToString } from "@/js/utils/ui/dateString";
import DynamicLabel from "@/components/DynamicLabel.vue";
import ActionButtons from "@/components/Campaigns/ActionButtons.vue";
import { changeStatus, pauseCallCampaign, startCallCampaign, stopCallCampaign } from "@/composable/campaign/action";
import ScenariosView from "@/pages/Scenarios/ScenariosView.vue";
import ContactsView from "@/pages/Contacts/ContactsView.vue";
import { useUserStore } from "@/store/user";
import CurlAddContacts from "@/components/CopyFields/CurlAddContacts.vue";

const toast = useToast()
const route = useRoute();
const router = useRouter();
const storeCampaign = useCampaignStore()
const campaign = ref(null)
const isLoading = ref(true)
const isOpenModalLogs = ref(false)
const toggleSettings = ref(null)
const toggleNotify = ref(null)

const goPageCampaign = () => {
  router.push({ name: 'campaign' })
}

const loadCampaign = async () => {
  try {
    await storeCampaign.loadCampaign(route.params.id);
    campaign.value = storeCampaign.getCampaigns[route.params.id];
  } catch (error) {
    if (error?.status === 404) {
      goPageCampaign()
    }
  } finally {
    isLoading.value = false
  }
}

const openModalLogs = async () => {
  isOpenModalLogs.value = true;
  try {
    await storeCampaign.loadLogs(route.params.id);
    campaign.value = storeCampaign.getCampaigns[route.params.id];
  } catch (error) {
    if (error?.status === 404) {
      goPageCampaign()
    }
  } finally {
    isLoading.value = false
  }
}

const fromCampaignCreate = ref(false)

onMounted(async () => {
  const res = localStorage.getItem('fromCampaignCreate')
  fromCampaignCreate.value = !!res || false
  localStorage.removeItem('fromCampaignCreate')

  await loadCampaign();
})

const handleActionButtons = async (cb, data) => {
  await cb(data);
  await loadCampaign();
}

const gridSystem = computed(() => {
  return {
    settings: {
      cols: '12',
      lg: '12'
    },
    settingsOther: {
      cols: '12',
      lg: '6',
      minH: '293',
    }
  }
})

const keyNotify = {
  "no_answer": 'form.Get_Call',
  "lead": 'form.Get_Action',
}
</script>

<template>
  <VRow v-if="campaign">
    <VCol md="7" cols="12" class="align-self-baseline">
      <VCard min-height="362">
        <VCardItem class="pa-md-8 pa-4">
          <VCardTitle class="mb-4 mt-2 text-xl-h5 d-flex justify-space-between">
            <span>
              Кампания - {{ campaign?.title }}
            </span>
            <div class="d-flex mr-5">
              <ActionButtons
                :item="campaign"
                @change:status="handleActionButtons(changeStatus, $event)"
                @click:pause-call="handleActionButtons(pauseCallCampaign, $event)"
                @click:start-call="handleActionButtons(startCallCampaign, $event)"
                @click:stop-call="handleActionButtons(stopCallCampaign, $event)"
              />
            </div>
          </VCardTitle>
          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">Статус:</h4>
            <DynamicLabel
              :value="$t('STATUSES_CALL_NAMES.' + campaign.statusCall)"
            />
          </div>
          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">Создана:</h4> {{ dateToString(campaign.createdAt) }}
          </div>
          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">Последнее изменение:</h4> {{ dateToString(campaign.updatedAt) }}
          </div>
          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">Установленный лимит:</h4> {{ campaign.limit ? campaign.limit + '₽' : '-' }}
          </div>

          <div class="d-flex flex-wrap mb-4 mt-5">
            <RouterLink :to="`/campaign/edit/${campaign.id}`">
              <VBtn class="" type="button">
                Редактировать
              </VBtn>
            </RouterLink>

            <VBtn class="ml-2" type="button" @click.stop="openModalLogs" variant="outlined">
              Открыть журнал
            </VBtn>
          </div>
        </VCardItem>
      </VCard>
    </VCol>
    <VCol md="5" cols="12">
      <VCard min-height="362" :class="fromCampaignCreate && 'border-focus'" style="z-index: 100">
        <VCardTitle class="mb-2 mt-2 text-xl-h5">База контактов
        </VCardTitle>

        <template v-if="campaign.contactsList">
          <div class="pa-md-5 pa-3 pt-md-0">
            <div class="font-weight-bold align-center d-flex mb-3">
              <h4 class="mr-2">Статус:</h4>
              <DynamicLabel
                :value="campaign.contactsList.status"
                class="mr-1"
              />
            </div>
            <div class="font-weight-bold align-center d-flex mb-3">
              <h4 class="mr-2">{{ $t('form.labels.name') }}:</h4> {{ campaign.contactsList.title }}
            </div>
            <div class="font-weight-bold align-center d-flex mb-3">
              <h4 class="mr-2">Дата создания:</h4>
              <div class="text-sm">{{ dateToString(campaign.contactsList.createdAt) }}</div>
            </div>
            <div class="font-weight-bold align-center d-flex mb-3">
              <h4 class="mr-2">Кол-во контактов базы:</h4> {{ campaign.contactsCount }}
            </div>
            <v-dialog width="1300px" max-width="95vw">
              <template v-slot:activator="{ props }">
                <VBtn v-bind="props" variant="outlined" size="small">
                  Открыть
                </VBtn>
              </template>

              <template v-slot:default="{ isActive }">
                <ContactsView
                  :contact_id="campaign.contactsList.id"
                />
              </template>
            </v-dialog>
          </div>
        </template>
        <template v-if="campaign.type === 'api'">
          <div class="mx-6 mb-5">
            <CurlAddContacts
              :campaign-id="campaign.id"
            />
          </div>
        </template>
      </VCard>
    </VCol>
    <VCol :cols="gridSystem.settings.cols" :lg="gridSystem.settings.lg">
      <VCard>
        <VCardItem class="pa-md-3 py-3 pt-1 pl-0 pr-0 ">
          <v-expansion-panels v-model="toggleSettings">
            <v-expansion-panel :value="true">
              <template #title>
                <VCardTitle class="text-xl-h5">
                  <div class=" text-xl-h5 ">{{ $t('form.labels.settings') }}</div>
                </VCardTitle>
              </template>
              <template #text>
                <div v-if="campaign.settings && Object.keys(campaign.settings).length > 0" class="mb-2">
                  <VCardTitle class="mb-2  text-xl-h6">{{ $t('settings.days') }}
                  </VCardTitle>
                  <div class="d-flex gap-2 gap-md-4 flex-wrap">
                    <div v-for="(day, key, index) in campaign.settings.days" :key="day" class="pa-1 rounded"
                         style="background: rgba(129,129,129,0.07)">
                      <VCheckbox
                        :model-value="day"
                        :readonly="true"
                        :label="$t('settings.weekDay.weekDay' + index)"
                        :style="{pointerEvents: 'none'}"
                        true-icon="bx-check"
                        false-icon="bx-x"
                      />
                    </div>
                  </div>
                </div>
                <template v-if="campaign.settings && Object.keys(campaign.settings).length > 0">
                  <div v-for="(setting, key) in campaign.settings" class="d-flex align-center">
                    <div v-if="key !== 'days'" class="d-flex align-center w-100 mb-2 pb-2 border-b ">
                      <h5 class="mr-3">{{ $t('settings.' + key) }}:</h5>
                      <div class="ml-auto">
                        <DynamicLabel
                          v-if="key === 'ringingSpeed'"
                          :value="$t('settings.ringingSpeedNames.' + setting)"
                        />
                        <DynamicLabel
                          v-else
                          :value="setting"
                        />
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="pt-0">
                  Настройки не выбраны
                </div>
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </VCardItem>

      </VCard>
    </VCol>
    <VCol :cols="gridSystem.settings.cols" :lg="gridSystem.settings.lg" >
      <VCard class="pl-0  pl-md-3 pr-3">
        <v-expansion-panels v-model="toggleNotify">
          <v-expansion-panel :value="true">
            <template #title>
              <VCardTitle class="text-xl-h5 pl-0">
                <div class=" text-xl-h5 ">{{ $t('form.labels.notify') }}</div>
              </VCardTitle>
            </template>
            <template #text>
              <template v-if="campaign.notifications && Object.keys(campaign.notifications).length > 0">
                <div v-for="(notification, key) in campaign.notifications" class="d-flex align-center">
                  <div v-if="key !== 'days'" class="d-flex align-center w-100 mb-1 pb-1 border-b ">
                    <h5 class="mr-3">
                      {{ $t(keyNotify[key]) || notification.method }}
                    </h5>
                    <div class="ml-auto">
                      <DynamicLabel
                        :not-uppercase="true"
                        :value="notification.url"
                      />
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="pt-0">
                Настройки уведомлений не выбраны
              </div>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </VCard>

    </VCol>


    <VCol :cols="gridSystem.settingsOther.cols" :lg="gridSystem.settingsOther.lg">
      <VCard v-if="campaign.scenario" :min-height="gridSystem.settingsOther.minH" class="pl-2 pl-md-3">
        <VCardItem class="pa-md-5 pa-3">
          <VCardTitle class="mb-4 mt-2 text-xl-h5">{{ $t('form.labels.scenario') }}
          </VCardTitle>

          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">Статус:</h4>
            <DynamicLabel
              :value="campaign.scenario.status "
              class="mr-1"
            />
          </div>
          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">{{ $t('form.labels.name') }}:</h4> {{ campaign.scenario.title }}
          </div>
          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">Распознавание речи:</h4>
            <DynamicLabel
              :value="campaign.scenario.speech_recognition"
            />
          </div>
          <div class="font-weight-bold align-center d-flex mb-3">
            <h4 class="mr-2">Дата создания:</h4>
            <div class="text-sm">{{ dateToString(campaign.scenario.createdAt) }}</div>
          </div>
          <v-dialog width="1300px" max-width="95vw">
            <template v-slot:activator="{ props }">
              <VBtn v-bind="props" variant="outlined" size="small">
                Открыть
              </VBtn>
            </template>

            <template v-slot:default="{ isActive }">
              <ScenariosView
                :scenarios_id="campaign.scenario.id"
                @update:save="loadCampaign"
              />
            </template>
          </v-dialog>
        </VCardItem>
      </VCard>
    </VCol>
    <VCol :cols="gridSystem.settingsOther.cols" :lg="gridSystem.settingsOther.lg">
    </VCol>
  </VRow>
  <CampaignListLogModal v-model="isOpenModalLogs" :campaign="campaign"/>
</template>
