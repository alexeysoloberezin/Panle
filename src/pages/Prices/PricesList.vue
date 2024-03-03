<template>
  <div>
    <v-card class="mb-4">
      <v-row class="pa-5 pb-3 align-center">
        <v-col cols="12" md="7" class="d-flex">
          <div class="mr-2 ">
            <ButtonAddBalance />
          </div>
          <RouterLink v-if="isAdmin" to="/prices/change">
            <v-btn  variant="outlined" >{{ $t('actions.changePrices') }}</v-btn>
          </RouterLink>
        </v-col>
        <v-col cols="12" md="5" class="pt-md-2 pt-0">
          <div class="ml-auto d-flex justify-md-end d-flex align-center gap-3">
            <v-chip
              color="info"
              label
            >
              {{ balance }} руб
            </v-chip>
            <TooltipInfo
              :text="$t('form.tooltips.price')"/>
          </div>
        </v-col>
      </v-row>

      <SetPriceFull
        :price="price"
        :readonly="true"
      />
    </v-card>
  </div>
</template>

<script setup>
import TooltipInfo from "@/components/TooltipInfo.vue";
import ButtonAddBalance from "@/components/Buttons/ButtonAddBalance.vue";
import {usePriceStore} from "@/store/price";
import {useUserStore} from "@/store/user";
import SetPriceForm from "@/components/Modals/SetPrice/SetPriceForm.vue";
import SetPriceFull from "@/components/Modals/SetPrice/SetPriceFull.vue";

const priceStore = usePriceStore()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const isAdmin = computed(() => userStore.isAdmin)
const price = computed(() => priceStore.price)
const balance = computed(() => userStore.getBalance)
const tab = ref('calls')


onMounted(() => {
  priceStore.getPrice()
})
</script>

<style scoped>

</style>
