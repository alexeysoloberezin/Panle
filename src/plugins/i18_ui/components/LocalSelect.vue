<template>
  <div>
    <div v-resize="onResize" class="locale-changer">
      <v-select
        v-model="locale"
        variant="solo"
        :items="locales"
        item-value="key"
        :item-title="windowSize?.x > 400 ? 'name' : 'key'"
      ></v-select>
    </div>
  </div>
</template>

<script setup>
import {useI18Store} from "@/plugins/i18_ui/i18Store";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const i18Store = useI18Store()
const {locale: localeI18} = useI18n()
const locales = computed(() => i18Store.availableLocales)

const windowSize = ref({
  x: 0,
  y: 0,
})

const onResize = () => {
  windowSize.value = { x: window.innerWidth, y: window.innerHeight }
}

onMounted(() => {
  onResize()
})

const locale = computed({
  get() {
    return i18Store.activeLocale
  },
  set(val) {
    localeI18.value = val
    i18Store.$patch({
      activeLocale: val
    })

    window.location.reload()
  }
})
</script>

<style scoped>

</style>
