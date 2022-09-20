import { Ref, watch, effectScope } from 'vue'
import { useCurrentEvent, useEventList, useEvents } from '@/store'
import { getUserData } from './getUserData'
import { setUserData } from './setUserData'
export const useRecordTime = (
  seconds: Ref<number>,
  isFinish: Ref<boolean>
): any => {
  const currentEventStore = useCurrentEvent()
  const eventListStore = useEventList()
  const eventsStore = useEvents()
  let isPositive = currentEventStore.currentEvent.isPositive
  let count = 0
  let type: 'event_1' | 'event_2' | 'event_3'
  getType()
  const scope = effectScope()
  scope.run(() => {
    watch(isFinish, (val: boolean) => {
      if (!val) {
        return
      }
      eventListStore.spliceList(
        currentEventStore.currentEvent.type,
        currentEventStore.currentEvent.id,
        false
      )
      const time = new Date()
      eventsStore.pushEvents({
        time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
        msg: `指令${currentEventStore.currentEvent.name}已完成`
      })
      const user_data = getUserData()
      user_data[type].findIndex((item: any, index: number) => {
        if (item.id === currentEventStore.currentEvent.id) {
          user_data[type].splice(index, 1)
          setUserData(user_data)
          return true
        }
      })
      currentEventStore.resetCurrentEvent(false)
    })
    watch(
      () => currentEventStore.currentEvent,
      () => {
        count = 0
        getType()
        isPositive = currentEventStore.currentEvent.isPositive
        scope.stop()
      }
    )
    watch(seconds, () => {
      count++
      if (isPositive && count === 30) {
        count = 0
        const user_data = getUserData()
        user_data[type].findIndex((item: any, index: number) => {
          if (item.id === currentEventStore.currentEvent.id) {
            user_data[type][index].positiveTime += 0.5
            return true
          }
        })
        let today = new Date().getDay()
        if (today === 0) {
          today = 7
        }
        user_data.history.thisweek[today - 1] += 0.5
        setUserData(user_data)
        eventListStore.incrementTime(
          currentEventStore.currentEvent.type,
          currentEventStore.currentEvent.id
        )
      }
      if (!isPositive && count === 30) {
        count = 0
        const user_data = getUserData()
        user_data[type].findIndex((item: any, index: number) => {
          if (item.id === currentEventStore.currentEvent.id) {
            user_data[type][index].positiveTime += 0.5
            return true
          }
        })
        let today = new Date().getDay()
        if (today === 0) {
          today = 7
        }
        user_data.history.thisweek[today - 1] += 0.5
        setUserData(user_data)
        eventListStore.decrementTime(
          currentEventStore.currentEvent.type,
          currentEventStore.currentEvent.id
        )
      }
    })
  })
  function getType() {
    switch (currentEventStore.currentEvent.type) {
      case 1:
        type = 'event_1'
        break
      case 2:
        type = 'event_2'
        break
      case 3:
        type = 'event_3'
    }
  }
}
