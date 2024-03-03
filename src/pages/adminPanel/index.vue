<template>
  <div>
    <h2 class="mb-3">{{ $t('pages.adminPanel') }}</h2>

    <v-row>
      <v-col cols="12" md="4">
        <v-card >
          <v-card-title>
            Локализация
          </v-card-title>
          <v-card-text>
            <router-link to="/i18">
              <v-btn>Открыть</v-btn>
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </div>

</template>

<script setup>

</script>

<style scoped>

</style>
