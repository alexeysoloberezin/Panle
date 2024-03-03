<template>
  <v-form>
    <v-row v-for="(field, key) in getFields" :key="key" class="align-center">
      <v-col cols="6">
        <v-label>{{ priceLabels[key] || key }}</v-label>
      </v-col>
      <v-col cols="6" class="d-flex align-center gap-2">
        <v-text-field v-model.number="fields[fieldsKey][key]" :readonly="readonly" ></v-text-field>
        руб.
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, toRefs } from "vue";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const props = defineProps(['fields', 'readonly', 'fieldsKey', 'defLabel'])
const emit = defineEmits(['update:fields', 'update:save'])
const { fields, readonly, fieldsKey } = toRefs(props);

const {t} = useI18n()
const priceLabels = {
  'default': props?.defLabel || t('form.price.defPrice'),
};

const getFields = computed(() => {
  const fields = { ...props.fields[props.fieldsKey] };
  const defaultValue = fields.default;

  delete fields.default;

  fields.default = defaultValue;

  return fields;
})

const value = computed({
  get() {
    return fields.value
  },
  set(value) {
    emit('update:fields', value)
  }
})


const saveChanges = () => {
  emit('update:save')
};
</script>
<style scoped>
</style>
