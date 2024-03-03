<template>
  <div>
    <v-card class="mb-3 pa-3">
      <div class="d-flex align-center gap-3">
        <v-btn @click="save">{{ $t('actions.save') }}</v-btn>

        <v-checkbox v-model="proMod" label="Pro mode">
        </v-checkbox>

        <v-select
          v-model="typeForm"
          :items="typeFormItems"
          item-title="name"
          item-value="key"
        ></v-select>
      </div>


    </v-card>

    <v-card class="my-2 pa-3">
      <div v-if="typeForm === 'addField'">
        <h4 class="mb-3">Добавить язык:</h4>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="newLang.key" label="Ключ" placeholder="en"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="newLang.name" label="Название" placeholder="English"></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn @click="addLocale">{{ $t('actions.add') }}</v-btn>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <h4 class="mb-3">Скачать или импортировать языки:</h4>
        <v-row>
          <v-col cols="12" sm="4">
            <v-file-input
              v-model="fileLocales"
              label="Выберите файл"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn @click="uploadLocales" class="mr-2">Импортировать</v-btn>
            <v-btn @click="downloadLocales">Скачать</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <div class="d-md-flex gap-3">
      <v-card v-for="(locale) in availableLocales" :key="locale.key" class="flex-grow-1">
        <v-btn class="mt-4 mx-4" variant="outlined" @click="i18Store.deleteLocales(locale.key)">Удалить язык</v-btn>
        <RecursiveRender :object="locales[locale.key]" :locale="locale.key" :pro-mod="proMod"/>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import {useI18Store} from "@/plugins/i18_ui/i18Store";
import RecursiveRender from "@/plugins/i18_ui/components/RecursiveRender.vue";
import {useToast} from "vue-toastification";
import i18Core from "@/plugins/i18_ui/i18Core";

const i18Store = useI18Store()
const locales = computed(() => {
  return i18Store.locales
})
const availableLocales = computed(() => i18Store.availableLocales)

const fileLocales = ref(null)
const typeForm = ref('importFromFile')
const typeFormItems = [
  {
    name: 'Добавить поле',
    key: 'addField'
  },
  {
    name: "Импортировать из файла",
    key: 'importFromFile'
  }
]

const proMod = ref(false)
const newLang = ref({
  key: "",
  name: ""
})

const toast = useToast()
const addLocale = () => {
  if (!newLang.value.name || !newLang.value.key) {
    toast.error('Не полные данные!')
    return;
  }
  i18Store.addLocaleString(newLang.value)
  newLang.value.key = ''
  newLang.value.name = ''
}

const downloadLocales = () => {
  i18Store.setGetLocales()
}

const uploadLocales = () => {
  if (!fileLocales.value || !fileLocales.value[0]) {
    toast.error('Не выбран файл!')
    return;
  }
  i18Store.setGetLocales(fileLocales.value[0])
}

const save = () => {
  i18Store.saveLocales()
}
</script>

<style>

</style>
