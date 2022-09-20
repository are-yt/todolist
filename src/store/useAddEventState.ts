import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useAddEventState = defineStore('addEventState', () => {
  const isAdd = ref(false)
  const updateIsAdd = () => (isAdd.value = !isAdd.value)
  return {
    isAdd,
    updateIsAdd
  }
})
