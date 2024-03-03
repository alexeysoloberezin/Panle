<template>
  <v-btn
    color="text"
    density="comfortable"
    class="balanceBox"
    variant="text"
    icon
  >
    <CoinsIcon />

    <v-menu activator="parent" >
      <div class="balanceBox-drop rounded">
        <v-chip
          color="info"
          label
        >
          {{ balance }} руб
        </v-chip>
        <TooltipInfo
          :text="$t('form.tooltips.price')"/>
      </div>
    </v-menu>
  </v-btn>
</template>

<script setup>
import CoinsIcon from "@/components/Icons/CoinsIcon.vue";
import TooltipInfo from "@/components/TooltipInfo.vue";
import {useUserStore} from "@/store/user";

const userStore = useUserStore()
const balance = computed(() => userStore.getBalance)
</script>

<style lang="scss">
.v-theme--dark{
  .balanceBox{
    &-drop{
      background: rgb(50, 50, 68);
    }
  }
}
.balanceBox{
  &-drop{
    background: #fff;
    display: flex;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    align-items: center;
    gap: 6px;
    padding: 10px 0 10px 10px;
  }
}
</style>
