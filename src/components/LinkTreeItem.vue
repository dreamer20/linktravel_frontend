<script setup>
import { ref } from 'vue';
import LinkButton from './LinkButton.vue';

const emit = defineEmits(['getLinks'])
const props = defineProps({
  link: Object,
  fetching: Array,
  level: Number,
  getLinks: Function
})

const isVisible = ref(false)

function getLinks() {
  emit('getLinks', props.link, props.level, () => isVisible.value = true)
}

function toggleVisibility() {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <li>
    <span v-if="link.error === true">{{ link.errorText }}</span>
    <template v-else>
      &#8627;<a :href="props.link.url">{{ props.link.url }}</a>
      <LinkButton
        @getLinks="getLinks"
        @toggleVisibility="toggleVisibility"
        :isOpen="isVisible"
        :hasContent="props.link.links.length > 0"
        :isFetching="props.fetching.findIndex(o => o[link.url] === props.level) !== -1"
         />
      <LinkTree
        :getLinks="props.getLinks"
        :url="props.link.url"
        :fetching="props.fetching"
        :links="props.link.links"
        :isVisible="isVisible"
        :level="props.level + 1" />
    </template>
  </li>
</template>