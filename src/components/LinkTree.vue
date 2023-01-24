<script setup>
import LinkTreeItem from './LinkTreeItem.vue';

const props = defineProps({
  url: String,
  links: Array,
  fetching: Array,
  isVisible: Boolean,
  getLinks: Function, 
  level: {
    type: Number,
    default: 1
  }
})
</script>

<template>
    <ul class="list-unstyled link-tree" :class="{isVisible: props.isVisible}">
      <LinkTreeItem v-for="(link, index) in props.links"
        :key="link.url"
        @getLinks="props.getLinks"
        :getLinks="props.getLinks"
        :link="link"
        :fetching="props.fetching"
        :level="props.level" />
    </ul>
</template>

<style scoped>
  .link-tree {
    padding-left: 15px;
    display: none;
  }

  .isVisible {
    display: block;
  }

</style>
