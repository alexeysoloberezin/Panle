<template>
  <div v-for="(item, k) in object" :key="k" class="">
    <div v-if="typeof item === 'object'" class="i18_box ma-4">
      <div class="d-flex pt-4 px-3 gap-3">
        <div class="text-h6  text-uppercase">
          {{ k }}
        </div>
        <v-btn v-if="proMod" variant="outlined" size="small" @click="i18Store.addTextInBox(parent, k)">
          Добавить текст
        </v-btn>
      </div>
      <RecursiveRender :object="item" :parent="parent ? parent + ',' + k : k" :locale="locale" :pro-mod="proMod"/>
    </div>
    <div v-else class="pa-2 d-flex gap-1 ">
      <div class="pa-1" style="width: 140px;font-size: 14px">
        {{ k }}
      </div>
      <textarea type="text" v-model.lazy="getLocalizedValue(parent)[k]" class="i18_input flex-grow-1" minlength="3"/>
<!--      <textarea type="text" :value="getLocalizedValue(parent)[k]" @change="updateValue(parent, k, $event.target.value)" class="i18_input flex-grow-1" minlength="3"/>-->
    </div>
  </div>
</template>

<script setup>
import {useI18Store} from "@/plugins/i18_ui/i18Store";

const props = defineProps(['object', "parent", "locale", 'proMod'])

const i18Store = useI18Store()
const locales = computed(() => i18Store.locales[props.locale])

function updateValue(parent, key, value) {
  const localizedValue = getLocalizedValue(parent);
  localizedValue[key] = value;
}

function getLocalizedValue(path) {
  if(!path){
    return null
  }

  const keys = path.split(',');
  let value = locales.value;

  for (const key of keys) {
    if (value && value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      return 'Key not found';
    }
  }

  return value;
}

</script>

<style lang="scss">
.i18_box {
  background: rgba(#374cda, 0.07);
  border-radius: 5px;
}

.i18_input {
  border: 1px solid rgba(255, 255, 255, 0.16);
  min-height: 35px;
  font-size: 14px;
  border-radius: 5px;
  padding: 8px;
  outline: none;
  transition: .2s;

  &::placeholder {
    font-size: 14px;
  }

  &:focus {
    border-color: #374cda;
  }
}
</style>
