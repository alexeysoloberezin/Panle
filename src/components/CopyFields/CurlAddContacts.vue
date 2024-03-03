<template>
  <CopyField
    :value="`${host}/api/campaign/${campaignId}/add-contacts?apiKey=${userApiKey}`"
    class="mt-4"
    :field-id="'newCampaign_copy'"
  >
    <template #tooltip>
      <h4>Данные можете передавать в следующем виде (json):</h4>
      <div>
        <p>1. Если передаете номер телефона и персональные данные клиентов:</p>
        <code>
          [
          {
          phone: телефон,
          firstname?: имя,
          lastname?: фамилия,
          secondname?: отчество,
          region?: регион,
          city?: город
          }
          ]
        </code>
        <p> 2. Если передаете только номера телефонов</p>
        <code>[89111516055, 89113334455]</code>
      </div>
    </template>
  </CopyField>
</template>

<script setup>
import CopyField from "@/components/CopyField.vue";
import {useUserStore} from "@/store/user";

const props = defineProps(['campaignId'])

const host = computed(() => import.meta.env.VITE_HOST)
const userStore = useUserStore()
const userApiKey = computed(() => userStore.getUserApiKey)
</script>

<style scoped>

</style>
