<script setup>
import { useToast } from "vue-toastification";
import Cookie from "@/components/Cookie.vue";

const toast = useToast()

onMounted(() => {
  if (!localStorage.getItem('accept-cookie')) {
    toast(Cookie, {
      timeout: false,
      position: 'bottom-center',
      closeButton: false,
      draggable: false,
      closeOnClick: false
    })
  }
})
</script>

<template>
  <div class="layout-wrapper layout-blank">
    <RouterView/>
  </div>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
