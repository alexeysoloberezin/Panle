<script setup>
import WriteDownAnswer from "@/components/Scenarios/WriteDownAnswer.vue";
import TooltipInfo from "@/components/TooltipInfo.vue";
import {toggleChangeViaVModel} from "@/composable/toggle";

const props = defineProps({
  value: {
    type: Object
  },
  ivr_blocks: {
    type: Array,
    required: false
  }
})
const emit = defineEmits(['update:modelValue'])
const value = toggleChangeViaVModel(props.value, (e) => {
  emit('update:modelValue', e)
})

const methods = [
  {title: 'GET', value: 'GET'},
  {title: 'POST', value: 'POST'}
]
</script>

<template>
  <VRow class="pa-3" no-gutters>
    <VCol
      cols="12"
      md="3"
      class="d-flex align-center"
    >
      <label>Метод:</label>
    </VCol>

    <VCol
      cols="12"
      md="9"
    >
      <VSelect
        :items="methods"
        v-model="value.methods"
      />
    </VCol>
  </VRow>
  <VRow class="pa-3" no-gutters>
    <VCol
      cols="12"
      md="3"
      class="d-flex align-center justify-lg-space-between"
    >
      <label>WebHook URL:</label>
      <!--      <TooltipInfo text="При данном действии на указанный url будет отправлен GET/POST-запрос c данными звонка."/>-->
      <TooltipInfo
        :isModern="true"
        :is-modern-id="'webhook'"
      >
        <template #modernTooltip>
          <div class="text-base">
            На указанный вами URL будет отправлен запрос с данными звонка. Вы можете использовать в URL следующие переменные, например:
          </div>
            <code>
            { <br/>
              phone: '79218089025', <br/>
              firstname: 'Алексей', <br/>
              lastname: Лавров', <br/>
              secondname: Романович', <br/>
              action: 'inaction', <br/>
              who_completed_call: ''system', <br/>
              attempt: 1, <br/>
              callerID: '9867307838', <br/>
              type_answering_machine: null, <br/>
              audio_recording: '2023/12/06/13-05-1-146919-9867307838-79218089025-1701857126.3726.mp3', <br/>
              sms: null, <br/>
              smsText: null <br/>
            }
          </code>
        </template>
      </TooltipInfo>
    </VCol>

    <VCol
      cols="12"
      md="9"
    >
      <VTextField placeholder="https://google.com" v-model="value.url"/>
    </VCol>
  </VRow>

  <WriteDownAnswer v-model:value="value"/>
</template>

<style scoped lang="scss">

</style>
