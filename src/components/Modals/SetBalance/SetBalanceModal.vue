<template>
  <v-dialog v-model="modal" width="500">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" @click="modal = true" size="x-small" width="24" height="24" icon class="ml-2" style="font-size: 18px">+</v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="pa-5">
        <v-form>
          <v-card-title class="pl-0">
            {{ $t('data.title.AddBalance') }} <span style="opacity: 0.7;font-size: 13px">({{ email }})</span>
          </v-card-title>
          <v-text-field v-model="value" :placeholder="$t('data.title.Balance')"></v-text-field>
          <v-btn v-if="userId" class="mt-3" @click="addBalance" :loading="loading">{{ $t('actions.topUp') }}</v-btn>
          <div v-else>User Id не корректный</div>
        </v-form>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import {usePriceStore} from "@/store/price";
import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import {useI18n} from "vue-i18n/dist/vue-i18n";


const props = defineProps(['userId', 'email'])
const priceStore = usePriceStore()

const tab = ref('calls')
const modal = ref(false)
const loading = ref(false)
const toast = useToast()

const value = ref(null)
// const date = ref(null)

const {t} = useI18n()
const addBalance = async () => {
  if(!value.value) return toast.warning(t('notifications.balanceRequired'));

  loading.value = true
  try {
    const res = await request.post(endpoints.users.ADD_BALANCE(props.userId), { value: value.value });
    if (res.status === 200) {
      toast.success(t('notifications.balanceReplenished'))
      priceStore.getClients()
      value.value = null
      modal.value = false
    }
  }finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>
