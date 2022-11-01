<template>
  <div id="main">
    <teleport to=".remind">
      <Transition name="remind">
        <AddRemind v-if="isShow" @hide="isShow = false" />
      </Transition>
    </teleport>
    <Carousel v-if="list.length" :list="list" />
    <div class="timer">
      <Timer />
    </div>
    <div class="footer-bar">
      <Footerbar @show-remind-panel="isShow = true" />
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
import AddRemind from '@/components/AddRemind.vue'
import { useAtStaView } from '@/store'
const atStaView = useAtStaView()
const isShow = ref(false)
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
.remind-enter-from,
.remind-leave-to {
  transform: translateY(-100%);
}
.remind-enter-active,
.remind-leave-active {
  transition: all 0.5s;
}
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
