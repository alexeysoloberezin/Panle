<script setup>
import { useToast } from "vue-toastification";
import { initToggle } from "@/composable/toggle";
import SettingsLabel from "@/components/SettingsLabel.vue";

const props = defineProps({
  value: {
    type: Boolean
  },
  settings: {
    type: Object,
    defaultValue: null,
  }
})
const { settings: settingsProp } = props
const emit = defineEmits(['update:modelValue', 'update:settings'])
const toast = useToast()

const sizeLabelMD = 6
const sizeInputMD = 6

const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})
const ringingSpeedOptions = [
  { value: 0, title: '1 раз в секунду или чаще (по возможности)' },
  // { value: 1, title: 'не чаще 1 раза в секунду' },
  // { value: 2, title: 'не чаще 1 раза в 2 секунды' },
  // { value: 5, title: 'не чаще 1 раза в 5 секунд' },
  // { value: 10, title: 'не чаще 1 раза в 10 секунд' },
  // { value: 20, title: 'не чаще 1 раза в 20 секунд' },
  // { value: 30, title: 'не чаще 1 раза в 30 секунд' },
  // { value: 60, title: 'не чаще 1 раза в минуту' },
  // { value: 120, title: 'не чаще 1 раза в 2 минуты' },
  // { value: 300, title: 'не чаще 1 раза в 5 минут' },
  // { value: 600, title: 'не чаще 1 раза в 10 минут' },
]

const pauseStartCallOptions = [
  { value: 0, title: '0 секунд' },
  { value: 0.6, title: '0.6 секунды' },
  { value: 1.2, title: '1.2 секунды' },
  { value: 1.8, title: '1.8 секунды' },
]

const defaultSettings = {
  countAttemptCall: 4,
  countCall: 2,
  intervalCall: 3600,
  startCall: "09:00",
  endCall: "21:00",
  ringingSpeed: ringingSpeedOptions[0].value,
  waitingTime: 27,
  pauseStartCall: pauseStartCallOptions[2].value,
  pauseEndAudio: 8,
  incomingCall: true,
  answeringMachine: true,
  answeringMachineIsMissed: false,
  pauseSpeechRecognition: 6,
  maxDurationCall: 1200,
  days: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false },
};

const settings = reactive({
  ...defaultSettings,
  ...settingsProp,
});

// Functions
const handleSubmit = () => {
  let days = Object.values(settings.days)
  let validateDays = days.filter(el => !!el)

  if(!validateDays.length){
    toast.error("Дни недели обязательны")
    return
  }

  emit('update:settings', { ...settings });
  isOpen.value = false
}

defineExpose({ handleSubmit })
</script>

<template>
  <v-dialog
    v-model="isOpen"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <VCard>
      <VToolbar
        dark
        color="primary"
      >
        <VToolbarTitle>{{ $t('form.labels.settings') }}</VToolbarTitle>
        <VSpacer></VSpacer>
        <VToolbarItems>
          <VBtn
            icon
            dark
            @click="isOpen = false"
          >
            <VIcon color="white" icon="mdi-close"></VIcon>
          </VBtn>
        </VToolbarItems>
      </VToolbar>
      <VForm @submit.prevent="handleSubmit">
        <VCol cols="12" md="12">
          <VRow>
            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'countAttemptCall'"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeInputMD"
            >
              <VTextField type="number" id="countAttemptCall" v-model="settings.countAttemptCall"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'countCall'"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeInputMD"
              class="d-flex align-center"
            >
              <VTextField type="number" id="countCall" class="mr-2" v-model="settings.countCall"/>
              {{ $t('settings.appendTxt.callsInLine') }}
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'intervalCall'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
              class="d-flex align-center"
            >
              <VTextField class="mr-2" type="number" id="intervalCall" v-model="settings.intervalCall"/>
              {{ $t('form.sec') }}
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'startCall'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
              class="d-flex align-center"
            >
              {{ $t('settings.appendTxt.from') }}
              <VTextField type="time" id="startCall" class="mx-2" v-model="settings.startCall"/>
              {{ $t('settings.appendTxt.to') }}
              <VTextField type="time" id="endCall" class="mx-2" v-model="settings.endCall"/>
              {{ $t('settings.appendTxt.clientTime') }}
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'ringingSpeed'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
            >
              <VSelect id="ringingSpeed" v-model="settings.ringingSpeed" :items="ringingSpeedOptions"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'waitingTime'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
              class="d-flex align-center"
            >
              <VTextField type="number" id="waitingTime" class="mr-2" v-model="settings.waitingTime"/>
              {{ $t('form.sec') }}
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'pauseStartCall'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
            >
              <VSelect id="pauseStartCall" v-model="settings.pauseStartCall" :items="pauseStartCallOptions"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'pauseEndAudio'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
              class="d-flex align-center"
            >
              <VTextField type="number" id="pauseEndAudio" class="mr-2" v-model="settings.pauseEndAudio"/>
              {{ $t('form.sec') }}
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'incomingCall'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
            >
              <VCheckbox id="incomingCall" v-model="settings.incomingCall"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'answeringMachine'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
            >
              <VCheckbox id="answeringMachine" v-model="settings.answeringMachine"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'answeringMachineIsMissed'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
            >
              <VCheckbox id="answeringMachineIsMissed" v-model="settings.answeringMachineIsMissed"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'pauseSpeechRecognition'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
              class="d-flex align-center"
            >
              <VTextField type="number" id="pauseSpeechRecognition" class="mr-2"
                          v-model="settings.pauseSpeechRecognition"/>
              {{ $t('form.sec') }}
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-space-between"
            >
              <SettingsLabel :labelKey="'maxDurationCall'"/>
            </VCol>
            <VCol
              cols="12"
              :md="sizeInputMD"
              class="d-flex align-center"
            >
              <VTextField type="number" id="maxDurationCall" placeholder="нет" class="mr-2"
                          v-model="settings.maxDurationCall"/>
              {{ $t('form.sec') }}
            </VCol>

            <VCol
              cols="12"
              :md="sizeLabelMD"
              class="d-flex align-center justify-lg-space-between"
            >
              <SettingsLabel :labelKey="'days'"/>
            </VCol>

            <VCol
              cols="12"
              :md="sizeInputMD"
            >
              <VCheckbox
                v-for="(day, key, index) in settings.days"
                v-model="settings.days[index + 1]"
                :label="$t('settings.weekDay.weekDay' + index)"
              />
            </VCol>
            <VCol
              cols="12">
              <VBtn type="submit" class="ml-auto">
                {{ $t('actions.save') }}
              </VBtn>
            </VCol>
          </VRow>
        </VCol>
      </VForm>
    </VCard>
  </v-dialog>
</template>
