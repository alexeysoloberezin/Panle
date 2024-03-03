<script setup>
import TooltipInfo from "@/components/TooltipInfo.vue";
import SelectScenarioModal from "@/views/pages/Scenarios/SelectScenarioModal.vue";
import SelectContactsListModal from "@/views/pages/Contacts/SelectContactsListModal.vue";
import {useToast} from "vue-toastification";
import SelectSettingsCampaign from "@/views/pages/Campaigns/SelectSettingsCampaign.vue";
import ChangeNotificationCampaign from "@/views/pages/Campaigns/ChangeNotificationCampaign.vue";
import {useScenariosStore} from "@/store/scenarios";
import {useContactsStore} from "@/store/contacts";
import AddContactListModal from "@/views/pages/Contacts/AddContactListModal.vue";
import CreateScenarioModal from "@/views/pages/Scenarios/CreateScenarioModal.vue";
import {loadContactsList} from "@/composable/contacts/loadContacts";
import {loadScenarios} from "@/composable/scenario/loadScenarios";
import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {helpers} from "@vuelidate/validators/dist/index";
import CurlAddContacts from "@/components/CopyFields/CurlAddContacts.vue";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const props = defineProps({
  campaign: {
    type: Object,
    defaultValue: null
  },
  campaignId: {
    type: String,
    defaultValue: null,
  },
  isLoading: Boolean
})

const storeScenario = useScenariosStore()
const storeContacts = useContactsStore()
const toast = useToast()
const router = useRouter()
const isLoadingRequest = ref(false)
const settingsCampaign = ref(null)

const defaultForm = {
  title: '',
  limit: '',
  type: "default",
  scenario: null,
  contactsList: null,
  settings: {},
  notifications: {}
}

const {t} = useI18n()
const rules = {
  title: {required: helpers.withMessage(t('data.helpers.nameRequired'), required)},
  scenario: {required: helpers.withMessage(t(''), required)},
  settings: {required: helpers.withMessage('Settings is required', required)},
  contactsList: {},
  $validationGroups: {
    newCampaign: ['title', 'scenario', 'contactsList']
  },
}

const form = reactive({
  ...defaultForm,
  ...props.campaign,
});
const v$ = useVuelidate(rules, form)


const sizeLabelMD = 3
const sizeInputMD = 9

const isOpenSelectScenario = ref(false)
const isOpenCreateScenario = ref(false)
const isOpenSelectContactsList = ref(false)

const isOpenSelectSettingsCampaign = ref(false)
const isOpenChangeNotificationCampaign = ref(false)
const isOpenAddContactListModal = ref(false)

const handleScenariosUpdated = async (id) => {
  await loadScenarios();
  form.scenario = id;
}
const handleContactsListUpdated = async (id) => {
  await loadContactsList();
  form.contactsList = id;
  validateBase()
}

const handleUpdateSettings = (data) => {
  form.settings = data;
}
const handleUpdateNotification = (data) => {
  form.notifications = data;
}

const contactsListError = ref(false)

const validateBase = () => {
  contactsListError.value = form.type === 'default' && !form.contactsList
}

const handleSubmit = async (run) => {
  if(Object.keys(form.settings).length === 0) {
    await settingsCampaign.value.handleSubmit()
  }

  await v$.value.$validate()
  validateBase()
  const {$errors} = v$.value.$validationGroups.newCampaign
  if (contactsListError.value) return null
  if (Array.isArray($errors) && $errors.length > 0) return null;

  isLoadingRequest.value = true
  try {
    const res = await request.post(endpoints.campaign.CREATE, {...form, run});

    if (res.status === 201) {
      toast.success(t('notifications.campaignCreated'))
      if (form.type === 'api') {
        localStorage.setItem('fromCampaignCreate', 'yes')
        await router.push({name: 'campaign-view', params: {id: res.data}});
      } else {
        await router.push({name: 'campaign'})
      }
    }
  } catch (err) {
  } finally {
    isLoadingRequest.value = false
  }
}

const handleSubmitEdit = async () => {
  await v$.value.$validate()
  validateBase()
  const {$errors} = v$.value.$validationGroups.newCampaign

  if (contactsListError.value) return null
  if (Array.isArray($errors) && $errors.length > 0) return null;

  isLoadingRequest.value = true
  try {
    const res = await request.post(endpoints.campaign.EDIT, {...form});

    if (res.status === 201) {
      toast.success(t('notifications.campaignModified'))
      await router.push('/campaign/view/' + props.campaignId)
    }
  } catch (err) {
  } finally {
    isLoadingRequest.value = false
  }

}

</script>

<template>
  <VForm @submit.prevent :disabled="isLoading"
         :style="{opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none': ''}">
    <VRow v-if="form">
      <VCol cols="12">
        <VRow>
          <VCol
            cols="12"
            :md="sizeLabelMD"
            class="d-flex align-center py-0 pa-md-3"
          >
            <label for="title">{{ $t('form.labels.nameCampaign') }}</label>
          </VCol>

          <VCol
            cols="12"
            :md="sizeInputMD"
          >
            <VTextField
              id="title"
              v-model="form.title"
              @input="v$.title.$touch"
              @blur="v$.title.$touch"
              :error-messages="v$.title.$errors.map(e => e.$message)"
              placeholder="John"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            :md="sizeLabelMD"
            class="d-flex align-center justify-space-between"
          >
            <label for="limit">{{ $t('form.labels.limitCampaign') }}</label>
            <TooltipInfo
              text="Задайте лимит денег на кампанию; если лимит отсутствует, то оставьте поле пустым (возможно небольшое превышение лимита при высокой скорости прозвона)"/>
          </VCol>

          <VCol
            cols="12"
            :md="sizeInputMD"
            class="d-flex align-center"
          >
            <VTextField
              type="number"
              id="limit"
              v-model.number="form.limit"
              placeholder="нет"
              class="mr-2"
            />
            ₽
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            :md="sizeLabelMD"
            class="d-flex align-center justify-space-between"
          >
            <label>{{ $t('form.labels.scenarios') }}</label>
            <TooltipInfo text="Сценарий, в котором указан аудиоролик для воспроизведения и реакции"/>
          </VCol>
          <VCol
            cols="12"
            :md="sizeInputMD"
          >

            <VChip
              v-if="form.scenario && storeScenario.getScenarios[form.scenario]?.title"
              closable
              @click:close="form.scenario = null"
              class="mr-2"
            >
              {{ storeScenario.getScenarios[form.scenario]?.title }}
            </VChip>
            <VBtn class="mr-2" @click="isOpenSelectScenario = true">{{ $t('actions.choose') }}</VBtn>
            <VBtn color="success" @click="isOpenCreateScenario = true">{{ $t('actions.launch') }}</VBtn>
            <div v-if="v$.scenario.$error" class="text-error mt-1">{{ v$.scenario.required.$message }}</div>
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            :md="sizeLabelMD"
            class="d-flex align-start justify-space-between mt-3"
          >
            <label>{{ $t('form.labels.contacts') }}</label>
            <TooltipInfo text="База телефонных номеров, на которые будут совершаться звонки"/>
          </VCol>

          <VCol
            cols="12"
            :md="sizeInputMD"
            class="d-md-flex gap-4 align-start"
          >
            <div
              :style="{pointerEvents: form.type === 'api' ? 'none' : '', opacity: form.type === 'api' ? '.35' : '1'}">
              <VChip
                v-if="form.contactsList"
                closable
                @click:close="form.contactsList = null;"
                class="mr-2"
              >{{ storeContacts.getContactsList[form.contactsList]?.title }}
              </VChip>
              <VBtn class="mr-2" @click="isOpenSelectContactsList = true">{{ $t('actions.choose') }}</VBtn>
              <VBtn color="success" @click="isOpenAddContactListModal = true">{{ $t('actions.launch') }}</VBtn>
              <div v-if="contactsListError" class="text-error mt-1">{{ $t('data.helpers.baseRequired') }}</div>
            </div>
            <div class="d-flex gap-3 align-center">
              <v-checkbox v-model="form.type" @update:model-value="validateBase();form.contactsList = null;"
                          :true-value="'api'" :false-value="'default'" :label="$t('form.APIdatabases')"></v-checkbox>
              <TooltipInfo
                v-if="form.type === 'api'"
                :is-modern="true"
                :is-modern-id="'newCampaign'"
              >
                <template #modernTooltip>
                  <h4>{{ $t('form.tooltips.byApi.title') }}</h4>
                  <p>{{ $t('form.tooltips.byApi.text') }}</p>
                </template>
              </TooltipInfo>
            </div>
          </VCol>
          <VCol v-if="campaignId && form.type === 'api'" offset-md="3" class="pt-0">
            <CurlAddContacts
              :campaign-id="campaignId"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            :md="sizeLabelMD"
            class="d-flex align-center justify-space-between"
          >
            <label>{{ $t('form.labels.settings') }}</label>
            <TooltipInfo text="Благодаря дополнительным настройкам можно более гибко настроить ваш обзвон"/>
          </VCol>

          <VCol
            cols="12"
            :md="sizeInputMD"
          >
            <VBtn @click="isOpenSelectSettingsCampaign = true">{{ $t('actions.install') }}</VBtn>
            <div v-if="v$.settings.$error" class="text-error text-md mt-1">
              {{ v$.settings.$errors.map(m => m.$message)[0] }}
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            :md="sizeLabelMD"
            class="d-flex align-center justify-space-between"
          >
            <label>{{ $t('form.labels.notify') }}</label>
            <TooltipInfo text="Эти настройки служат для оповещения вашего ПО о изменении статуса звонка"/>
          </VCol>

          <VCol
            cols="12"
            :md="sizeInputMD"
          >
            <VBtn @click="isOpenChangeNotificationCampaign = true">{{ $t('actions.install') }}</VBtn>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12">
        <template v-if="campaign">
          <VBtn :loading="isLoadingRequest" type="button" @click="handleSubmitEdit()" class="mr-2">
            {{ $t('actions.save') }}
          </VBtn>
        </template>
        <template v-else>
          <VBtn :loading="isLoadingRequest" :disabled="form.type === 'api'"
                :style="{opacity: form.type === 'api' ? '.4' : '1'}" type="button" @click="handleSubmit(true)"
                class="mr-2">
            {{ $t('actions.createLaunch') }}
          </VBtn>
          <VBtn :loading="isLoadingRequest" type="button" @click="handleSubmit(false)">

            {{ $t('actions.createNotLaunch') }}
          </VBtn>
        </template>

      </VCol>
    </VRow>
    <SelectScenarioModal v-model="isOpenSelectScenario" @scenario:selected="handleScenariosUpdated"/>
    <CreateScenarioModal v-model="isOpenCreateScenario" @scenario:created="handleScenariosUpdated"/>
    <SelectContactsListModal v-model="isOpenSelectContactsList" @contacts-list:selected="handleContactsListUpdated"/>
    <SelectSettingsCampaign
      v-model="isOpenSelectSettingsCampaign"
      ref="settingsCampaign"
      @update:settings="handleUpdateSettings"
      :settings="form.settings"
    />
    <ChangeNotificationCampaign
      v-model="isOpenChangeNotificationCampaign"
      @update:notification="handleUpdateNotification"
      :notifications="form.notifications"
    />
    <AddContactListModal v-model="isOpenAddContactListModal" @contacts:added="handleContactsListUpdated"/>
  </VForm>
</template>

<style lang="scss">
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
