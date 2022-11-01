import { ref } from 'vue'
import { defineStore } from 'pinia'
interface RemindItem {
  id: number
  name: string
  abortTime: number
  time: number
  email: string
}
export const useRemind = defineStore('remind', () => {
  const remind = ref<RemindItem[]>([])
  // 每次进入app时调入数据
  const updateRemind = () => {
    let remindStorage = utools.dbStorage.getItem('remind')
    if (!remindStorage) {
      utools.dbStorage.setItem(
        'remind',
        JSON.stringify({
          id: 0,
          list: []
        })
      )
    }
    remindStorage = JSON.parse(utools.dbStorage.getItem('remind'))
    remind.value = remindStorage.list
  }
  // 添加
  const addRemind = (
    name: string,
    abortTime: number,
    time: number,
    email: string
  ) => {
    const remindStorage = JSON.parse(utools.dbStorage.getItem('remind'))
    remind.value.push({
      id: remindStorage.id++,
      name,
      abortTime,
      time,
      email
    })
    remindStorage.list = remind.value
    utools.dbStorage.setItem('remind', JSON.stringify(remindStorage))
  }
  // 删除
  const delRemind = (id: number) => {
    const remindStorage = JSON.parse(utools.dbStorage.getItem('remind'))
    const index = remind.value.findIndex((item: any) => item.id === id)
    remind.value.splice(index, 1)
    remindStorage.list = remind.value
    utools.dbStorage.setItem('remind', JSON.stringify(remindStorage))
  }
  return {
    remind,
    updateRemind,
    addRemind,
    delRemind
  }
})
