import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useEventState = defineStore('state', () => {
  const isStart = ref(false)
  const updateIsStart = () => {
    isStart.value = !isStart.value
  }
  return {
    isStart,
    updateIsStart
  }
})
