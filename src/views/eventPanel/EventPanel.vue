<template>
  <div id="event-panel">
    <teleport to=".event-panel">
      <Transition name="slide-in">
        <AddEvent v-if="addEventStore.isAdd" @addto="add" @cancel="cancelAdd" />
      </Transition>
    </teleport>
    <template v-if="events.length">
      <TransitionGroup name="fade">
        <template v-for="(item, index) in events" :key="index">
          <div class="item">
            <span>{{ item.time }}</span>
            <span>{{ item.msg }}</span>
          </div>
        </template>
      </TransitionGroup>
      <div class="item">{{ waitting }}</div>
    </template>
    <template v-else>
      <div class="item">等待指令发出...</div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'EventPanel'
}
</script>
<script setup lang="ts">
import AddEvent from '@/components/AddEvent.vue'
import { ref } from 'vue'
import { useEvents, useAddEventState, useEventList } from '@/store'
import { Events } from '@/tools'
import { EventItem } from '@/tools'
const events = ref<Events[]>([])
const eventsStore = useEvents()
const addEventStore = useAddEventState()
const eventListStore = useEventList()
events.value = eventsStore.events
const waitting = ref('.')
setInterval(() => {
  if (waitting.value.length !== 6) {
    waitting.value += '.'
  } else {
    waitting.value = '.'
  }
}, 500)
// 确认添加
const add = (event: EventItem) => {
  eventListStore.addEvent(event)
  addEventStore.updateIsAdd()
}
// 取消添加
const cancelAdd = () => {
  addEventStore.updateIsAdd()
}
</script>

<style lang="less" scoped>
#event-panel {
  width: inherit;
  height: inherit;
  overflow: auto;
  .item {
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-size: 12px;
    color: #ccc;
    span:nth-child(1) {
      flex: 0.8;
    }
    span:nth-child(2) {
      width: 70%;
    }
  }
}
</style>
