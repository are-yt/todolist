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
import { useCurrentEvent, useEventState, useEventList } from '@/store'
import { useRecordTime } from '@/tools'
import { ElNotification, ElMessageBox } from 'element-plus'
import Worker from 'worker-loader!@/workers/worker.ts'
let worker = new Worker()
const currentEvent = useCurrentEvent()
const eventState = useEventState()
const eventListStore = useEventList()
const minutes = ref()
const seconds = ref()
const isFinish = ref(false)
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
    useRecordTime(isFinish)
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
      worker.terminate()
    }
  }
)
const recordTime = () => {
  const isPositive = currentEvent.currentEvent.isPositive
  worker = new Worker()
  worker.postMessage(true)
  let count = 0
  worker.onmessage = () => {
    if (seconds.value === 0 && minutes.value === 0 && !isPositive) {
      // 只中止倒计时，正向计时无上限状态
      isFinish.value = true
      worker.terminate()
    } else if (++count === 25 * 60) {
      // 番茄钟特性，每25分钟提醒一次休息
      stop()
      utools.showNotification('休息提醒,计时已暂停', 'home')
      ElMessageBox.confirm('25分钟了,您可以休息几分钟再继续', '休息提醒', {
        confirmButtonText: '好的',
        cancelButtonText: '不必了'
      })
        .then(() => {
          // 点击了确认，进入休息，暂停计时
        })
        .catch(() => {
          // 点击了取消，继续工作，继续计时
          start()
        })
    }
    if (!isPositive) {
      if (seconds.value === 0) {
        seconds.value = 59
        minutes.value--
      } else {
        seconds.value--
      }
    } else {
      if (seconds.value === 59) {
        seconds.value = 0
        minutes.value++
      } else {
        seconds.value++
      }
    }
    if (seconds.value === 30 || seconds.value === 0) {
      const type = currentEvent.currentEvent.type
      const id = currentEvent.currentEvent.id
      // 每30秒保存一次记录
      if (isPositive) {
        // 正向计时记录
        eventListStore.incrementTime(type, id)
        return
      }
      if (!isPositive) {
        // 倒计时记录
        eventListStore.decrementTime(type, id)
      }
    }
  }
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
