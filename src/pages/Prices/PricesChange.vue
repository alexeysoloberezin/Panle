<template>
  <div>
    <!--    change-->
    <v-card class="mb-4 pa-4">
      <SetPriceModal :price="defaultPrice" @update:saveChanges="saveDefPrice"/>
      <v-checkbox v-model="personalPrice" :label="$t('form.price.onlyWithPersonal')" class="mt-2"></v-checkbox>
    </v-card>
    <v-card class="mb-4">
      <v-text-field v-model="searchClients" variant="solo" :label="$t('form.search')"></v-text-field>
    </v-card>
    <v-row >
      <v-col
        v-for="client in clients"
        :key="client.id"
        cols="12"
        sm="6"
        md="6"
        lg="4"
      >
        <v-card class="pt-2 pb-5">
          <v-card-title>[{{ client.id }}]  -  {{ client.email }}</v-card-title>
          <v-card-subtitle class="mb-1">{{ client.phone }}</v-card-subtitle>
          <v-card-subtitle>{{ $t('data.title.Balance') }}:
            <v-chip
              color="info"
              label
            >
              {{ client.balance }} руб
            </v-chip>
            <SetBalanceModal :user-id="client.id" :email="client.email"/>
          </v-card-subtitle>
          <v-card-subtitle class="mt-3 d-flex flex-md-row flex-column align-md-center gap-2">
            <v-btn @click="changePrice(client.id)" :loading="changePriceModalLoading" :text="$t('actions.changePrices')" size="small"></v-btn>

            <v-dialog v-model="changePriceModal" width="500">
              <template v-slot:default="{ isActive }">
                <SetPriceFull
                  :price="price"
                  @update:saveChanges="save"
                />
              </template>
            </v-dialog>

            <div :class="isDefaultPrice(client.price.type) ? '' : 'text-primary font-weight-bold'">
              {{ isDefaultPrice(client.price.type) ? $t('form.price.defPrice') : $t('form.price.personalPrice') }}
            </div>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import {usePriceStore} from "@/store/price";
import {useUserStore} from "@/store/user";
import SetPriceModal from "@/components/Modals/SetPrice/SetPriceModal.vue";
import SetBalanceModal from "@/components/Modals/SetBalance/SetBalanceModal.vue";
import SetPriceFull from "@/components/Modals/SetPrice/SetPriceFull.vue";

const priceStore = usePriceStore()
const userStore = useUserStore()
const defaultPrice = computed(() => priceStore.defaultPrice)
const price = computed(() => priceStore.price)

const user = computed(() => userStore.user.id)
const searchClients = ref('')
const personalPrice = ref(false)
const changePriceModal = ref(false)
const changePriceModalLoading = ref(false)
const activeUser = ref(null)

const clients = computed(() => {
  if (!searchClients.value) {
    if (personalPrice.value) {
      return priceStore.clients.filter(client => !isDefaultPrice(client.price.type));
    } else {
      return priceStore.clients;
    }
  }

  return priceStore.clients.filter(client => {
    return client.email.toLowerCase().includes(searchClients.value.toLowerCase()) &&
      (!personalPrice.value || !isDefaultPrice(client.price.type));
  });
})

const isDefaultPrice = (type) => (type === 'default')

onMounted(() => {
  priceStore.getDefaultPrice()
  priceStore.getClients()
})

const changePrice = async (user_id) => {
  changePriceModalLoading.value = true
  try {
    activeUser.value = user_id
    await priceStore.getUserPrice(user_id)
    changePriceModal.value = true
  }finally {
    changePriceModalLoading.value = false
  }
}

const saveDefPrice = async (data) => {
  await priceStore.setDefaultPrice(data)
}

const save = async (data) => {
  try {
    await priceStore.setPrice({data, userId: activeUser.value})
    activeUser.value = null
    changePriceModal.value = false
    await priceStore.getClients()
  }catch (err){
    console.error(err)
  }
}
</script>

<style scoped>

</style>
