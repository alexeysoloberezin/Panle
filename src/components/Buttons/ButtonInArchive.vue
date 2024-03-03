<template>
  <VBtn
    icon
    size="x-small"
    width="25"
    height="25"
    :color="status === STATUSES.ACTIVE ? 'error' : 'success'"
  >
    <VIcon :icon="status === STATUSES.ACTIVE ? 'bx-trash' : 'mdi-reply'"/>
    <VTooltip
      activator="parent"
    >{{ status === STATUSES.ACTIVE ? $t('actions.inArchive') : $t('actions.restore') }}
    </VTooltip>
  </VBtn>
</template>

<script setup>
import { STATUSES } from "@/js/statuses";
defineProps(['status'])
</script>

<style scoped>

</style>
