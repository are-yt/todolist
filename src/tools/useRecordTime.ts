import { Ref, watch, effectScope } from 'vue'
import { useCurrentEvent, useEventList, useEvents } from '@/store'
import { getUserData } from './getUserData'
import { setUserData } from './setUserData'
export const useRecordTime = (isFinish: Ref<boolean>): any => {
  const currentEventStore = useCurrentEvent()
  const eventListStore = useEventList()
  const eventsStore = useEvents()
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
        getType()
        scope.stop()
      }
    )
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
