<template>
  <div class="timer-main">
    <div class="timer">
      <div class="content" v-if="currentEvent.currentEvent.name">
        <span>{{ currentEvent.currentEvent.name }}</span>
        <!-- 倒计时 -->
        <span v-if="!currentEvent.currentEvent.isPositive">
          {{ minutes > 9 ? minutes : '0' + minutes }}
          :
          {{ seconds > 9 ? seconds : '0' + seconds }}
        </span>
        <!-- 正向计时 -->
        <span v-else>
          {{ minutes > 9 ? minutes : '0' + minutes }}
          :
          {{ seconds > 9 ? seconds : '0' + seconds }}
        </span>
        <span>
          {{ currentEvent.currentEvent.isPositive ? '正向计时' : '倒计时' }}
        </span>
      </div>
      <div class="content" v-else>
        <span>等待指令...</span>
      </div>
    </div>
    <img
      src="~@/assets/images/timer/play.svg"
      @click="start"
      v-show="!eventState.isStart"
    />
    <img
      src="~@/assets/images/timer/stop.svg"
      @click="stop"
      v-show="eventState.isStart"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useCurrentEvent, useEventState } from '@/store'
import { useRecordTime } from '@/tools'
import { ElNotification } from 'element-plus'
const currentEvent = useCurrentEvent()
const eventState = useEventState()
const minutes = ref()
const seconds = ref()
const isFinish = ref(false)
let timer: any
// 响应核心事件的变化，更新timer界面等
watch(
  () => currentEvent.currentEvent,
  (val: any) => {
    if (!val.name) {
      minutes.value = ''
      seconds.value = ''
      return
    }
    if (val.isPositive) {
      const positiveTime = val.positiveTime.toString().split('.')
      minutes.value = Number(positiveTime[0])
      seconds.value = positiveTime[1] ? 30 : 0
    } else {
      const time = val.time.toString().split('.')
      minutes.value = Number(time[0])
      seconds.value = time[1] ? 30 : 0
    }
    isFinish.value = false
    useRecordTime(seconds, isFinish)
  }
)
// 侦听完成状态，以发出通知
watch(isFinish, (val: boolean) => {
  if (!val) {
    return
  }
  ElNotification.success({
    title: '事件',
    message: '事件已完成',
    duration: 0
  })
  utools.showNotification('事件完成，点击返回', 'home')
  eventState.updateIsStart()
})
// 侦听timer的开始/暂停状态
watch(
  () => eventState.isStart,
  val => {
    if (val) {
      // 开始计时
      recordTime()
    } else {
      // 暂停计时
      clearInterval(timer)
    }
  }
)
const recordTime = () => {
  let runtime = 0
  const isPositive = currentEvent.currentEvent.isPositive
  timer = setInterval(() => {
    const startTime = performance.now()
    if (minutes.value === 0 && seconds.value === 0 && !isPositive) {
      // 倒计时结束，事件执行完成
      isFinish.value = true
      clearInterval(timer)
    }
    if (isPositive) {
      if (seconds.value === 59) {
        seconds.value = 0
        minutes.value++
      } else {
        seconds.value++
      }
    }
    if (!isPositive) {
      if (seconds.value === 0) {
        seconds.value = 59
        minutes.value--
      } else {
        seconds.value--
      }
    }
    const end = performance.now()
    runtime = (end - startTime) * 1000
  }, 1000 - runtime)
}
// 鼠标-开始计时
const start = () => {
  if (currentEvent.currentEvent.name) {
    eventState.updateIsStart()
  }
}
// 鼠标暂停计时
const stop = () => {
  if (currentEvent.currentEvent.name) {
    eventState.updateIsStart()
  }
}
</script>

<style scoped lang="less">
.timer-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .timer {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    position: relative;
    border: 10px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      text-align: center;
      span:nth-child(1) {
        font-size: 18px;
        letter-spacing: 2px;
        margin-bottom: 20px;
        width: 200px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      span:nth-child(2) {
        font-size: 30px;
        letter-spacing: 5px;
      }
      span:nth-child(3) {
        font-size: 18px;
        margin-top: 20px;
      }
    }
  }
  img {
    width: 40px;
    height: 40px;
    margin-top: 3em;
  }
}
</style>
