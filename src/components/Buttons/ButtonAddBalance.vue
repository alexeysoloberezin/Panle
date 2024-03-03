<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" :text="$t('actions.topUp')"> </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card :title="$t('data.title.AddBalance')">
        <v-card-text>
          {{ $t('data.title.AddBalanceText') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Ok"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

</script>

<style scoped>

</style>
