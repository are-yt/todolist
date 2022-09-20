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
import { useControlPanelState } from './store'
const controlPanelState = useControlPanelState()
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
