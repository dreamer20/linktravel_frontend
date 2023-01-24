<script setup>
const props = defineProps({
  statusCode: Number,
  text: String
})
</script>

<template>
  <div class="text-center">
    <div class="header">{{ props.statusCode }}</div>
    <div class="text">{{ props.text }}</div>
  </div>
</template>

<style scoped>
  .header {
    font-size: 64px;
    font-weight: 700;
  }

  .text {
    font-size: 24px;
  }
</style>