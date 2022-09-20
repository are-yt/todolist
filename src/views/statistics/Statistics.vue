<template>
  <div id="statistics">
    <div class="return-home">
      <img
        src="~@/assets/images/statistics/return.svg"
        @click="$router.replace('/')"
      />
    </div>
    <div class="main-content">
      <div class="preweek" ref="preweekDom"></div>
      <div class="thisweek" ref="thisweekDom"></div>
      <span class="all-time">
        <span>上周专注时长:{{ preweekAllTime }}(分钟)</span>
        <span>本周已专注时长:{{ thisweekAllTime }}(分钟)</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { getUserData, setUserData } from '@/tools'
import { useAtStaView } from '@/store'
useAtStaView().updateAtStaview(true)
const preweekDom = ref<HTMLElement>()
const thisweekDom = ref<HTMLElement>()
const preweekAllTime = ref(0)
const thisweekAllTime = ref(0)
const user_data = getUserData()
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
preweekAllTime.value = user_data.history.preweek.reduce(
  (pre: number, item: number) => {
    return (pre += item)
  },
  0
)
thisweekAllTime.value = user_data.history.thisweek.reduce(
  (pre: number, item: number) => {
    return (pre += item)
  },
  0
)
onMounted(() => {
  echarts.init(preweekDom.value as HTMLElement).setOption({
    title: {
      text: '上周数据'
    },
    tooltip: {},
    legend: {
      data: ['时长(分钟)']
    },
    xAxis: {
      data: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期天'
      ]
    },
    yAxis: {},
    series: [
      {
        name: '时长(分钟)',
        type: 'bar',
        data: user_data.history.preweek
      }
    ]
  })
  echarts.init(thisweekDom.value as HTMLElement).setOption({
    title: {
      text: '本周数据'
    },
    tooltip: {},
    legend: {
      data: ['时长(分钟)']
    },
    xAxis: {
      data: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期天'
      ]
    },
    yAxis: {},
    series: [
      {
        name: '时长(分钟)',
        type: 'bar',
        data: user_data.history.thisweek
      }
    ]
  })
})
</script>
<style lang="less" scoped>
#statistics {
  height: inherit;
  background: #a29bfe;
  position: relative;
  .return-home {
    padding: 5% 0 0 5%;
    img {
      width: 30px;
      height: 30px;
    }
  }
  .main-content {
    height: 80%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    .preweek,
    .thisweek {
      height: 70%;
      margin-left: 5%;
    }
    .preweek {
      width: 45%;
    }
    .thisweek {
      flex: 1;
    }
    .all-time {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: space-around;
      left: 0;
      bottom: 5%;
    }
  }
}
</style>
