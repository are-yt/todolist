import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useControlPanelState = defineStore('panelState', () => {
  const isControl = ref(true)
  const updateIsControl = () => (isControl.value = !isControl.value)
  return {
    isControl,
    updateIsControl
  }
})
