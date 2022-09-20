interface EventItem {
  type: 1 | 2 | 3
  id: number
  name: string
  time: number | null
  isPositive: boolean
  positiveTime: number
}
interface History {
  thisweek: number[]
  preweek: number[]
  lastchange: null | number
}
interface Events {
  time: string
  msg: string
}
interface Data {
  id: number
  event_1: EventItem[]
  event_2: EventItem[]
  event_3: EventItem[]
  createAt: null | number
  history: History
  events: Events[]
}
export const setUserData = (data: Data, key = 'todolist'): void => {
  utools.dbStorage.setItem(key, JSON.stringify(data))
}

export { EventItem, Events }
