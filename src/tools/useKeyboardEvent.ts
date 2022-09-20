import { onMounted } from 'vue'
import {
  useEventState,
  useEditState,
  useAddEventState,
  useControlPanelState,
  useCurrentEvent,
  useAtStaView
} from '@/store'
export const useKeyboardEvent = (): any => {
  // 计时[事件]的状态
  const stateStore = useEventState()
  // 编辑[事件]的状态
  const editStateStore = useEditState()
  // 添加[事件]的状态
  const addEventState = useAddEventState()
  // 左侧面板状态
  const controlPanelStore = useControlPanelState()
  // 当前核心事件
  const currentEventStore = useCurrentEvent()
  // 统计页面存活状态，用于屏蔽一些快捷键操作
  const atStaview = useAtStaView()
  let state: 0 | 1 = 0
  const keys: string[] = ['KeyN', 'KeyB', 'Space']
  onMounted(() => {
    document.onkeyup = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        state = 0
      }
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      if (
        e.code === 'Space' &&
        currentEventStore.currentEvent.name &&
        !atStaview.atStaview &&
        state
      ) {
        stateStore.updateIsStart()
        return
      }
      if (e.code === 'KeyB' && state) {
        controlPanelStore.updateIsControl()
      }
      if (e.code === 'KeyN' && state && !editStateStore.isEdit) {
        addEventState.updateIsAdd()
        return
      }
    }
    document.onkeydown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Control') {
        state = 1
      } else if (!keys.includes(e.code)) {
        // 这个的目的是精确按键
        state = 0
      }
    }
  })
}
