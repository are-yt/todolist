import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useAtStaView = defineStore('atStaView', () => {
  const atStaview = ref(false)
  const updateAtStaview = (val: boolean) => (atStaview.value = val)
  return {
    atStaview,
    updateAtStaview
  }
})
