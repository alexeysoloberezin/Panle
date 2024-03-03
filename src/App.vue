<script setup>
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import {request} from "@/js/utils/actions/request";
import {useI18Store} from "@/plugins/i18_ui/i18Store";

const { global } = useTheme()
const i18Store = useI18Store()

onMounted(() => {
  i18Store.fetchLocales()
})

</script>

<template>
  <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
    <RouterView/>
  </VApp>
</template>
