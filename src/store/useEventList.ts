import { getUserData, setUserData, isClearEventList } from '@/tools'
import { EventItem } from '@/tools'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useEvents } from './useEvents'
export const useEventList = defineStore('eventList', () => {
  const eventsStore = useEvents()
  let user_data = getUserData()
  if (isClearEventList(user_data.createAt)) {
    user_data.event_1 = []
    user_data.event_2 = []
    user_data.event_3 = []
    user_data.createAt = new Date().getTime()
    user_data.events = []
    user_data.id = 0
    setUserData(user_data)
  }
  // 重新获取user_data
  user_data = getUserData()
  const list = reactive({
    event_1: user_data.event_1,
    event_2: user_data.event_2,
    event_3: user_data.event_3
  })
  // 删除事件
  const spliceList = (type: 1 | 2 | 3, id: number, pushEvent = true) => {
    const user_data = getUserData()
    const time = new Date()
    let msg = ''
    if (type === 1) {
      const index = list.event_1.findIndex((item: any) => item.id === id)
      msg = `高级指令[${list.event_1[index].name}]已删除`
      list.event_1.splice(index, 1)
      user_data.event_1 = list.event_1
    } else if (type === 2) {
      const index = list.event_2.findIndex((item: any) => item.id === id)
      msg = `中级指令[${list.event_2[index].name}]已删除`
      list.event_2.splice(index, 1)
      user_data.event_2 = list.event_2
    } else {
      const index = list.event_3.findIndex((item: any) => item.id === id)
      msg = `低级指令[${list.event_3[index].name}]已删除`
      list.event_3.splice(index, 1)
      user_data.event_3 = list.event_3
    }
    // 变更本地数据
    setUserData(user_data) // 这个必须放在前面，以防后写覆盖events添加的内容
    if (pushEvent) {
      eventsStore.pushEvents({
        time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
        msg
      })
    }
  }
  // 倒计时同步
  const decrementTime = (type: 1 | 2 | 3, id: number) => {
    const user_data = getUserData()
    if (type === 1) {
      const index = list.event_1.findIndex((item: any) => item.id === id)
      list.event_1[index].time -= 0.5
      user_data.event_1 = list.event_1
    } else if (type === 2) {
      const index = list.event_2.findIndex((item: any) => item.id === id)
      list.event_2[index].time -= 0.5
      user_data.event_2 = list.event_2
    } else {
      const index = list.event_3.findIndex((item: any) => item.id === id)
      list.event_3[index].time -= 0.5
      user_data.event_3 = list.event_3
    }
    // 变更本地数据
    setUserData(user_data)
  }
  // 正计时同步
  const incrementTime = (type: 1 | 2 | 3, id: number) => {
    if (type === 1) {
      const index = list.event_1.findIndex((item: any) => item.id === id)
      list.event_1[index].positiveTime += 0.5
    } else if (type === 2) {
      const index = list.event_2.findIndex((item: any) => item.id === id)
      list.event_2[index].positiveTime += 0.5
    } else {
      const index = list.event_3.findIndex((item: any) => item.id === id)
      list.event_3[index].positiveTime += 0.5
    }
  }
  // 添加事件
  const addEvent = (obj: EventItem) => {
    const user_data = getUserData()
    const { type, name, time, isPositive } = obj
    const temp = {
      id: ++user_data.id,
      name,
      time,
      positiveTime: 0,
      isPositive,
      type
    }
    const date = new Date()
    let msg = ''
    if (type === 1) {
      list.event_1.push(temp)
      user_data.event_1 = list.event_1
      msg = `高级指令[${name}]已添加`
    } else if (type === 2) {
      list.event_2.push(temp)
      user_data.event_2 = list.event_2
      msg = `中级指令[${name}]已添加`
    } else {
      list.event_3.push(temp)
      user_data.event_3.push(temp)
      msg = `低级指令[${name}]已添加`
    }
    // 变更本地数据
    user_data.createAt = new Date().getTime()
    setUserData(user_data) // 必须放在前面，以防后写覆盖events添加的内容
    eventsStore.pushEvents({
      time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      msg
    })
  }
  // 编辑事件
  const updateEvent = (obj: EventItem, originalType: 1 | 2 | 3) => {
    let type: 'event_1' | 'event_2' | 'event_3'
    let typeString: '高级指令' | '中级指令' | '低级指令'
    let moveToString: '高级指令' | '中级指令' | '低级指令'
    switch (originalType) {
      case 1:
        type = 'event_1'
        typeString = '高级指令'
        break
      case 2:
        type = 'event_2'
        typeString = '中级指令'
        break
      case 3:
        type = 'event_3'
        typeString = '低级指令'
    }
    let moveTo: 'event_1' | 'event_2' | 'event_3'
    switch (obj.type) {
      case 1:
        moveTo = 'event_1'
        moveToString = '高级指令'
        break
      case 2:
        moveTo = 'event_2'
        moveToString = '中级指令'
        break
      case 3:
        moveTo = 'event_3'
        moveToString = '低级指令'
    }
    const user_data = getUserData()
    const index = list[type].findIndex((item: any) => item.id === obj.id)
    const originalName = list[type][index].name
    list[type][index].name = obj.name
    list[type][index].time = obj.time
    list[type][index].isPositive = obj.isPositive
    list[type][index].type = obj.type
    const temp = list[type][index]
    list[type].splice(index, 1)
    list[moveTo].push(temp)
    user_data.event_1 = list.event_1
    user_data.event_2 = list.event_2
    user_data.event_3 = list.event_3
    setUserData(user_data) // 必须放在前面，以防后写覆盖events添加的内容
    const time = new Date()
    eventsStore.pushEvents({
      time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
      msg: `${typeString}[${originalName}]已被更改为${moveToString}[${
        list[moveTo][list[moveTo].length - 1].name
      }]`
    })
  }
  return {
    list,
    spliceList,
    decrementTime,
    incrementTime,
    addEvent,
    updateEvent
  }
})
