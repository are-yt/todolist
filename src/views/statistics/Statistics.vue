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
import { getUserData } from '@/tools'
import { useAtStaView } from '@/store'
useAtStaView().updateAtStaview(true)
const preweekDom = ref<HTMLElement>()
const thisweekDom = ref<HTMLElement>()
const preweekAllTime = ref(0)
const thisweekAllTime = ref(0)
const user_data = getUserData()
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
