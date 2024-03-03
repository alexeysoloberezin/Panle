<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" :text="btnText || $t('actions.changeDefPrice')" :size="btnSize"> </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <SetPriceFull
        :price="price"
        :readonly="readonly"
        @update:saveChanges="save"
      />
    </template>
  </v-dialog>
</template>

<script setup>
import SetPriceFull from "@/components/Modals/SetPrice/SetPriceFull.vue";

const props = defineProps(['btnText', 'price', 'readonly', 'btnSize'])
const emit = defineEmits(['update:saveChanges'])

const save = (price) => {
  emit("update:saveChanges", price)
}
</script>

<style scoped>

</style>
