import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EventItem } from '@/tools'
import { useEvents } from './useEvents'
export const useCurrentEvent = defineStore('currentExecute', () => {
  const events = useEvents()
  const currentEvent = ref<EventItem>({
    id: 0,
    type: 1,
    name: '',
    time: null,
    isPositive: false,
    positiveTime: 0
  })
  const updateCurrentEvent = (event: EventItem) => {
    currentEvent.value = event
    const time = new Date()
    let type: '高级指令' | '中级指令' | '低级指令'
    switch (event.type) {
      case 1:
        type = '高级指令'
        break
      case 2:
        type = '中级指令'
        break
      case 3:
        type = '低级指令'
    }
    events.pushEvents({
      time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
      msg: `${type}[${event.name}]已下达`
    })
  }
  const resetCurrentEvent = (pushEvent = true) => {
    currentEvent.value = {
      id: 0,
      type: 1,
      name: '',
      time: null,
      isPositive: false,
      positiveTime: 0
    }
    const time = new Date()
    if (!pushEvent) {
      return
    }
    events.pushEvents({
      time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
      msg: '指令已撤销'
    })
  }
  return {
    currentEvent,
    updateCurrentEvent,
    resetCurrentEvent
  }
})
