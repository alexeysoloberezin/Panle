<script setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'
import { useUserStore } from "@/store/user";
import { useToast } from "vue-toastification";
import ModalConfirmation from "@/components/ModalConfirmation.vue";
import {initAllSSE} from "@/js/utils/actions/sse/seeMain";
import ModalCampaignNotify from "@/components/Modals/ModalCampaignNotify.vue";


const usersStore = useUserStore()
const toast = useToast()
onMounted(async () => {
  await usersStore.loadUserInfo();
  initAllSSE()
})
</script>

<template>
  <DefaultLayoutWithVerticalNav>
    <RouterView/>
  </DefaultLayoutWithVerticalNav>
  <ModalConfirmation/>
  <ModalCampaignNotify />
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
