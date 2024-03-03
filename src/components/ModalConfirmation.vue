<script setup>
import GlobalEvents, { EVENTS } from "@/js/utils/globalEvents";

const isOpen = ref(false)
const cb = ref(null);

GlobalEvents.addEventListener(EVENTS.OPEN_CONFIRMATION, (event) => {
  isOpen.value = true;
  cb.value = event.data?.callback
})

const handleConfirmation = () => {
  cb.value?.();
  isOpen.value = false;
}
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="auto"
  >
    <VCard>
      <VCardTitle>Подтвердить действие?</VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VBtn @click="isOpen = false">Отменить</VBtn>
          </VCol>
          <VCol cols="6">
            <VBtn color="success" @click="handleConfirmation">Подтвердить</VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
