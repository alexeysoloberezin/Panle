<template>
  <v-card>
    <v-tabs
      v-model="tab"
      class="px-4"
    >
      <v-tab value="calls">{{ $t('tabs.calls') }}</v-tab>
      <v-tab value="sms">{{ $t('tabs.sms') }}</v-tab>
    </v-tabs>
    <v-card-text v-if="price">
      <v-window v-model="tab">
        <v-window-item value="calls">
          <SetPriceForm
            v-model:fields="price"
            :fieldsKey="'calls'"
            :readonly="readonly"
            style="max-width: 700px;"
          />
        </v-window-item>

        <v-window-item value="sms">
          <SetPriceForm
            v-model:fields="price"
            :def-label="$t('form.price.otherOperators')"
            :fieldsKey="'sms'"
            :readonly="readonly"
            style="max-width: 700px;"
          />
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-card-text>
      <v-btn v-if="!readonly" @click="saveChanges">{{ $t('actions.save') }}</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import SetPriceForm from "@/components/Modals/SetPrice/SetPriceForm.vue";

const props = defineProps(['readonly', 'price'])
const emit = defineEmits(['update:saveChanges'])
const { price, readonly } = toRefs(props)

const tab = ref('calls')

const saveChanges = () => {
  emit('update:saveChanges', price.value)
}
</script>

<style scoped>

</style>
