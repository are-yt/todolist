<template>
  <div id="app">
    <div class="main-left">
      <Transition name="left-main" appear mode="out-in">
        <ControlPanel v-if="controlPanelState.isControl" />
        <EventPanel v-else />
      </Transition>
    </div>
    <div class="main-right">
      <RouterView #="{ Component }">
        <Transition name="right-move">
          <KeepAlive exclude="Statistics">
            <component :is="Component"></component>
          </KeepAlive>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import ControlPanel from './views/controlPanel/ControlPanel.vue'
import EventPanel from './views/eventPanel/EventPanel.vue'
import { getUserData, setUserData } from './tools'
import { useControlPanelState, useRemind } from './store'
import { emailRequest } from './request'
import { ElMessage } from 'element-plus'
import Worker from 'worker-loader!@/workers/remindTimer.ts'
const controlPanelState = useControlPanelState()
const remindStore = useRemind()
remindStore.updateRemind()
setTimeout(() => {
  remindStore.remind.forEach(item => {
    const time = item.time
    const now = new Date().getTime()
    if (time <= now) {
      // 没有提醒，但已过期，原因是在提醒时间段内程序被关闭
      remindStore.delRemind(item.id)
      ElMessage.warning({
        message: `${item.name}已过期，但未提醒，原因可能是再提醒时间段内程序被关闭`
      })
    } 
  })
})
const worker = new Worker()
// 单独线程计时，每分钟校验提醒事件是否进入提醒阶段
worker.postMessage(true)
worker.onmessage = () => {
  // 每一分钟会触发一次
  remindStore.remind.forEach(item => {
    // 把截止时间和提前提醒时间和现在的时间转为时间戳
    const abortTime = item.abortTime * 60 * 1000
    const time = item.time
    const now = new Date().getTime()
    if (time <= abortTime + now) {
      // 到了提醒时间了，提醒然后删除该提醒
      emailRequest.request({
        url: `/qq.php?user=2821458718@qq.com&password=bmmbredqjpyydcga&email=${item.email}&bt=到时提醒&nr=: 设定的提醒任务[${item.name}]已到了提醒时间,已删除`,
        method: 'GET'
      })
      remindStore.delRemind(item.id)
    }
  })
}
// 检查用户本地数据
let user_data = getUserData()
// 用户还未存有本地数据
if (!user_data) {
  // 移植旧数据
  const old_user_data = getUserData('todo-user-data')
  if (old_user_data) {
    setUserData({
      id: 0,
      event_1: [],
      event_2: [],
      event_3: [],
      createAt: new Date().getTime(),
      history: {
        thisweek: old_user_data.historyData.thisweek,
        preweek: old_user_data.historyData.preweek,
        lastchange: old_user_data.historyData.lastChange
      },
      events: []
    })
  } else {
    // 添加默认本地数据
    setUserData({
      id: 0,
      event_1: [],
      event_2: [],
      event_3: [],
      createAt: new Date().getTime(),
      history: {
        thisweek: [0, 0, 0, 0, 0, 0, 0],
        preweek: [0, 0, 0, 0, 0, 0, 0],
        lastchange: new Date().getTime()
      },
      events: []
    })
  }
}
const today: any = new Date()
const lastChange: any = new Date(user_data.history.lastchange)
const today_date = today.getDate()
const lastChange_date = lastChange.getDate()
const today_day = today.getDay() === 0 ? 7 : today.getDay()
const lastChange_day = lastChange.getDay() === 0 ? 7 : lastChange.getDay()
if (
  today.getFullYear() === lastChange.getFullYear() &&
  today.getMonth() === lastChange.getMonth() &&
  today_date - today_day + 1 === lastChange_date - lastChange_day + 1
) {
  // 同年同月情况下，星期一的日期相同，是同周，不更改数据
} else if (
  today.getFullYear() === lastChange.getFullYear() &&
  today.getMonth() === lastChange.getMonth() &&
  today_date - today_day + 1 - 7 === lastChange_date - lastChange_day + 1
) {
  // 同年同月情况下，两周的星期一日期相减为七，所以是隔了一个周，本周数据给到上周，本周数据重置
  user_data.history.preweek = user_data.history.thisweek
  user_data.history.thisweek = [0, 0, 0, 0, 0, 0, 0]
  user_data.history.lastchange = new Date().getTime()
  setUserData(user_data)
} else if (
  today.getFullYear() === lastChange.getFullYear() &&
  today.getMonth() !== lastChange.getMonth() &&
  (today - lastChange) / (1000 * 60 * 60 * 24) <= 13
) {
  // 同年不同月，日期相减为<=13，表示是相隔了一个周或同一个周
  const oneDayTime = 1000 * 60 * 60 * 24
  const today_monday = new Date(
    today.getTime() - (today_day - 1) * oneDayTime
  ).getDate()
  const lastchange_monday = new Date(
    lastChange.getTime() - (lastChange_day - 1) * oneDayTime
  ).getDate()
  if (today_monday === lastchange_monday) {
    // 同周，不更改数据
  } else {
    user_data.history.preweek = user_data.history.thisweek
    user_data.history.thisweek = [0, 0, 0, 0, 0, 0, 0]
    user_data.history.lastchange = new Date().getTime()
    setUserData(user_data)
  }
} else if (
  today.getFullYear() !== lastChange.getFullYear() &&
  (today - lastChange) / (1000 * 60 * 60 * 24) <= 13
) {
  // 不同年，但日期相减为<=13，表示隔了一个周或一周内
  const oneDayTime = 1000 * 60 * 60 * 24
  const today_monday = new Date(
    today.getTime() - (today_day - 1) * oneDayTime
  ).getDate()
  const lastchange_monday = new Date(
    lastChange.getTime() - (lastChange_day - 1) * oneDayTime
  ).getDate()
  if (today_monday === lastchange_monday) {
    // 同周，不更改数据
  } else {
    // 隔了一个周
    user_data.history.preweek = user_data.history.thisweek
    user_data.history.thisweek = [0, 0, 0, 0, 0, 0, 0]
    user_data.history.lastchange = new Date().getTime()
    setUserData(user_data)
  }
} else {
  // 其他情况，至少隔了两个周，用户很久未上线了，本周和上周数据一并重置
  user_data.history.preweek = [0, 0, 0, 0, 0, 0, 0]
  user_data.history.thisweek = [0, 0, 0, 0, 0, 0, 0]
  user_data.history.lastchange = new Date().getTime()
  setUserData(user_data)
}
</script>

<style lang="less">
@import './assets/css/common.css';
@import './assets/css/styles.css';
#app {
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: space-between;
  .main-left {
    width: var(--main-left-width);
    padding: 0 10px;
    height: inherit;
    background: #f8f9fa;
    position: relative;
    overflow: hidden;
  }
  .main-right {
    flex: 1;
    height: inherit;
    position: relative;
    overflow: hidden;
  }
}
</style>
