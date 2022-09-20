<template>
  <div class="carousel">
    <ElCarousel
      height="100vh"
      indicator-position="none"
      loop
      :interval="1000 * 60 * 1.5"
    >
      <ElCarouselItem v-for="(item, index) in props.list" :key="index">
        <img :src="`https://cn.bing.com${item.url}`" />
      </ElCarouselItem>
    </ElCarousel>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{
  list: any[]
}>()
</script>

<style scoped lang="less">
.carousel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  img {
    display: block;
    width: 100%;
    height: inherit;
  }
}
</style>
