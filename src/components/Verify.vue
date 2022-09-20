<template>
  <div class="verify" @click="cancel">
    <div class="verify-card">
      <SlideVerify
        class="slider"
        :slider-text="props.sliderText"
        ref="slider"
        :w="320"
        :h="220"
        @success="suc"
        @fail="fail"
        :imgs="imgs"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SlideVerify from 'vue3-slide-verify'
import type { SlideVerifyInstance } from 'vue3-slide-verify'
import 'vue3-slide-verify/dist/style.css'
import { defineProps, ref, defineEmits } from 'vue'
const imgs = [require('../assets/images/verify/v1.png')]
const props = defineProps({
  sliderText: {
    type: String,
    default: '验证单元默认文本'
  }
})
const emits = defineEmits(['suc', 'cancel'])
const slider = ref<SlideVerifyInstance>()
const suc = () => {
  emits('suc')
}
const fail = () => {
  slider.value?.refresh()
}
const cancel = () => {
  emits('cancel')
}
</script>

<style scoped lang="less">
.verify {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: var(--verify-layer-zindex);
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
  .slider {
    position: relative;
    z-index: 200;
  }
}
</style>
