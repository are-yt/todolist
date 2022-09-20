import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserData, Events, setUserData } from '@/tools'
export const useEvents = defineStore('events', () => {
  const user_data = getUserData()
  const events = ref(user_data.events)
  const pushEvents = (event: Events) => {
    const user_data = getUserData()
    if (events.value.length === 10) {
      events.value.splice(0, 1)
      events.value.push(event)
      user_data.events = events.value
    } else {
      events.value.push(event)
      user_data.events = events.value
    }
    setUserData(user_data)
  }
  return {
    events,
    pushEvents
  }
})
