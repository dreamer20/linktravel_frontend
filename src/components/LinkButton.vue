<script setup>
import { ref, computed } from '@vue/reactivity';

const emit = defineEmits(['getLinks', 'toggleVisibility'])
const props = defineProps({
  isFetching: Boolean,
  hasContent: Boolean,
  isOpen: Boolean
})

const btnText = computed(() => props.isOpen  ? '-' : '+')

function toggleVisibility() {
  emit('toggleVisibility')
}

</script>

<template> 
  <div
    v-if="props.isFetching"
    class="spinner-border spinner-border-sm ms-1 text-secondary"
    role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <button
    v-else-if="props.hasContent"
    @click="toggleVisibility"
    type="button"
    class="btn btn-outline-secondary ms-1 b" 
    style="--bs-btn-padding-y: .0rem; --bs-btn-padding-x: .0rem; --bs-btn-font-size: .75rem;">
  {{ btnText }}
  </button>
  <button
    v-else
    @click.prevent="emit('getLinks')"
    type="button"
    class="btn btn-outline-secondary ms-1" 
    style="--bs-btn-padding-y: .0rem; --bs-btn-padding-x: .4rem; --bs-btn-font-size: .75rem;">
  +
  </button>
</template>

<style scoped>
.b {
  width: 20px;
}
</style>