<template>
  <div id="main">
    <Carousel v-if="list.length" :list="list" />
    <div class="timer">
      <Timer />
    </div>
    <div class="footer-bar">
      <Footerbar />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Main'
}
</script>
<script setup lang="ts">
import { ref, onActivated } from 'vue'
import { requestBgList } from '@/request'
import { useKeyboardEvent } from '@/tools'
import Carousel from './cpns/Carousel.vue'
import Timer from './cpns/Timer.vue'
import Footerbar from './cpns/Footerbar.vue'
import { useAtStaView } from '@/store'
const atStaView = useAtStaView()
useKeyboardEvent()
const list = ref([])
requestBgList().then(res => {
  list.value = res.data.images
})
onActivated(() => {
  atStaView.updateAtStaview(false)
})
</script>

<style lang="less" scoped>
#main {
  width: inherit;
  height: inherit;
  position: relative;
  .timer {
    height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .footer-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4vh;
    background: rgba(0, 0, 0, 0.1);
    padding: 10px;
    transition: height 0.2s linear;
    &:hover {
      height: 8vh;
    }
  }
}
</style>
