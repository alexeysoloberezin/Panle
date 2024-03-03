<script setup>
import WriteDownAnswer from "@/components/Scenarios/WriteDownAnswer.vue";
import ForwardingToNumber from "@/components/Scenarios/ForwardingToNumber.vue";
import ForwardingToSIP from "@/components/Scenarios/ForwardingToSIP.vue";
import SendSmsToClient from "@/components/Scenarios/SendSmsToClient.vue";
import AddToStopList from "@/components/Scenarios/AddToStopList.vue";
import WebHook from "@/components/Scenarios/WebHook.vue";
import GoToIvr from "@/components/Scenarios/GoToIvr.vue";
import { useToast } from "vue-toastification";
import TooltipInfo from "@/components/TooltipInfo.vue";
import { toggleChangeViaVModel } from "@/composable/toggle";
import { useVuelidate } from "@vuelidate/core";
import {helpers, maxLength, required} from "@vuelidate/validators";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const props = defineProps({
  value: {
    type: Object
  }
})
const emit = defineEmits(['update:modelValue', 'submit:form'])

const {t} = useI18n()
const rules = {
  title: { required: helpers.withMessage(t('data.helpers.nameRequired'), required), maxLength: maxLength(2000)},
  audioClip: { required: helpers.withMessage(t('data.helpers.audioRequired'), required)},
  $validationGroups: {
    scenario: ['title', 'audioClip']
  },
}

const v$ = useVuelidate(rules, props.value)

const form = toggleChangeViaVModel(props.value, (e) => {
  emit('update:modelValue', e)
})

const toast = useToast()
const router = useRouter();
if (form.value.id) {
  for (const key in form.value) {
    if (!['createdAt', 'updatedAt', 'status'].includes(key)) {
      if (key === 'ivr_scenarios') {
        form.value[key] = form.value[key].map(item => item.value)
      } else {
        form.value[key] = form.value[key]
      }
    }
  }
  form.value.ivr_blocks = form.value.ivr_scenarios.map(block => {
    return Object.keys(block.reaction).reduce((acc, key) => {
      acc[key] = block.reaction[key].id;
      return acc;
    }, {})
  })
}

const ivrList = [
  { id: 1, title0: 'Нажал 1', title1: 'Нажал 1 / Произнёс "Один"' },
  { id: 2, title0: 'Нажал 2', title1: 'Нажал 2 / Произнёс "Два"' },
  { id: 3, title0: 'Нажал 3', title1: 'Нажал 3 / Произнёс "Три"' },
  { id: 4, title0: 'Нажал 4', title1: 'Нажал 4 / Произнёс "Четыре"' },
  { id: 5, title0: 'Нажал 5', title1: 'Нажал 5 / Произнёс "Пять"' },
  { id: 6, title0: 'Нажал 6', title1: 'Нажал 6 / Произнёс "Шесть"' },
  { id: 7, title0: 'Нажал 7', title1: 'Нажал 7 / Произнёс "Семь"' },
  { id: 8, title0: 'Нажал 8', title1: 'Нажал 8 / Произнёс "Восемь"' },
  { id: 9, title0: 'Нажал 9', title1: 'Нажал 9 / Произнёс "Девять"' },
  { id: 0, title0: 'Нажал 0', title1: 'Нажал 0 / Произнёс "Ноль"' },
  { id: 'yes', title0: '', title1: 'Произнёс "Да"' },
  { id: 'no', title0: '', title1: 'Произнёс "Нет"' },
  { id: 'next', title0: '', title1: 'Произнёс "Вперёд"' },
  { id: 'prev', title0: '', title1: 'Произнёс "Назад"' }
]

const ivrSelectList = [
  { value: false, title: '---------', },
  { value: 1, title: 'Записать ответ', },
  // { value: 2, title: 'Переадресация на номер', },
  // { value: 3, title: 'Переадресация на SIP', },
  { value: 4, title: 'Отправить СМС клиенту', },
  { value: 5, title: 'Повтор ролика', },
  { value: 6, title: 'Добавить в стоп-лист', },
  { value: 7, title: 'WebHook', },
  { value: 8, title: 'Перейти к IVR #', },
]

const reaction = {
  1: { id: 1, audioClip: {} },
  // 2: { id: 2, audioClip: {} },
  // 3: { id: 3, audioClip: {} },
  4: { id: 4, audioClip: {}, text: '', name: 'default' },
  5: { id: 5 },
  6: { id: 6, audioClip: {} },
  7: { id: 7, audioClip: {}, methods: 'GET', url: '' },
  8: { id: 8, audioClip: {}, value: null },
}

const reactionComponent = {
  1: WriteDownAnswer,
  2: ForwardingToNumber,
  3: ForwardingToSIP,
  4: SendSmsToClient,
  // 5: Repeat,
  6: AddToStopList,
  7: WebHook,
  8: GoToIvr
}

const handleChangeIvrBlockReaction = (index, id, e) => {
  if (typeof form.value.ivr_scenarios[index] !== 'object') {
    form.value.ivr_scenarios[index] = { audioClip: {}, reaction: {} };
  }
  form.value.ivr_scenarios[index].reaction[id] = { ...reaction[e] }
}
const addIVR = () => {
  form.value.ivr_blocks.push({})
  form.value.ivr_scenarios.push({ audioClip: {}, reaction: {} })
}
const removeIVR = () => {
  form.value.ivr_blocks.pop()
  form.value.ivr_scenarios.pop()
}

const handleSubmit = async () => {
  await v$.value.$validate()
  const { $errors } = v$.value.$validationGroups.scenario
  if (Array.isArray($errors) && $errors.length > 0)  return null;

  emit('submit:form')
}
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-center"
          >
            <label for="title">{{ $t('form.labels.nameScenario') }}</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
              id="title"
              v-model="form.title"
              :error-messages="v$.title.$errors.map(e => e.$message)"
              @input="v$.title.$touch"
              @blur="v$.title.$touch"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>
      <WriteDownAnswer :title="$t('data.helpers.chooseAudio')" v-model:value="form"  :show-error="v$.audioClip.$error"/>
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex justify-lg-space-between align-center"
          >
            <label for="speech_recognition">{{ $t('form.labels.recognition') }}</label>
            <TooltipInfo :text="$t('form.tooltips.recognition')"/>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VCheckbox
              id="speech_recognition"
              v-model="form.speech_recognition"
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol
        cols="12"
        v-if="form.ivr_blocks?.length"
      >
        <VCard v-for="(block, index) in form.ivr_blocks" :key="index" class="mb-3 position-relative" style="z-index: 10;"
        >
          <VCardItem>
            <VCardTitle>IVR #{{ index + 1 }}</VCardTitle>
            <VCol cols="12" class="pl-0">
              <WriteDownAnswer class_row="mb-4" :title="$t('data.helpers.chooseAudio')" v-model:value="form.ivr_scenarios[index]"/>
              <VRow
                v-for="item in ivrList"
                :key="item.id"
                no-gutters>
                <template v-if="item['title' + +form.speech_recognition]">
                  <VCol
                    cols="12"
                    md="3"
                    class="d-flex align-center"
                  >
                    <label :for="`${index}${item.id}`">{{ item['title' + +form.speech_recognition] }}</label>
                  </VCol>

                  <VCol
                    cols="12"
                    md="9"
                  >
                    <VSelect
                      placeholder="---------"
                      :id="`${index}${item.id}`"
                      v-model="form.ivr_blocks[index][item.id]"
                      :items=ivrSelectList
                      @update:modelValue="handleChangeIvrBlockReaction(index, item.id, $event)"
                    />
                  </VCol>
                  <VCard class="w-100 ma-1 ma-md-3 mr-md-0 position-relative"
                         style="z-index: 10;"
                         v-if="reactionComponent[form.ivr_blocks[index][item.id]]">
                    <component
                      :is="reactionComponent[form.ivr_blocks[index][item.id]]"
                      :ivr_blocks="form.ivr_blocks"
                      v-model:value="form.ivr_scenarios[index].reaction[item.id]"/>
                  </VCard>
                </template>
              </VRow>
            </VCol>
          </VCardItem>

        </VCard>
      </VCol>
      <VCol cols="12">
        <VBtn prepend-icon="bx-plus" type="button" @click.prevent="addIVR">
          {{ $t('actions.addIVR') }}
        </VBtn>
        <VBtn class="ml-2" v-if="form.ivr_blocks?.length > 1" prepend-icon="bx-plus" type="button"
              @click.prevent="removeIVR">
          {{ $t('actions.removeIVR') }}
        </VBtn>
      </VCol>

      <VCol cols="12">
        <VBtn type="submit">
          {{ form.id ? $t('actions.save') : $t('actions.launch') }}
        </VBtn>
      </VCol>

    </VRow>
  </VForm>
</template>
