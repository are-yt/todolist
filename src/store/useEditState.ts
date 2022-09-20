import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useEditState = defineStore('editState', () => {
  const isEdit = ref(false)
  const updateIsEdit = () => (isEdit.value = !isEdit.value)
  return {
    isEdit,
    updateIsEdit
  }
})
