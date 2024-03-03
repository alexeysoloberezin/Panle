<script setup>
const emit = defineEmits(['close-toast'])

const closeCookie = () => {
  localStorage.setItem('accept-cookie', true)
  emit('close-toast')
}
</script>
<template>
  <div>
    <div> Мы используем файлы cookies для улучшения работы сайта. Оставаясь на нашем сайте, вы соглашаетесь с условиями
      использования файлов cookies.
    </div>
    <button
      @click="closeCookie"
      class="v-btn v-btn--block v-btn--elevated v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated mt-4">
      Принимаю
    </button>
  </div>
</template>
