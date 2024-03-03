<template>
  <div><slot :timeAgo="timeAgo"></slot></div>
</template>

<script setup>
import { useTimeAgo } from '@vueuse/core'

const props = defineProps(['time'])
const timeAgo = useTimeAgo(new Date(props.time))
</script>

<style scoped>

</style>
