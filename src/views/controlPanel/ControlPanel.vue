<template>
  <div id="control-panel">
    <!-- add event panel -->
    <teleport to=".event-panel">
      <Transition name="slide-in">
        <AddEvent v-if="addEventStore.isAdd" @addto="add" @cancel="cancelAdd" />
      </Transition>
    </teleport>
    <!-- add event panel ended -->
    <!-- update event panel -->
    <teleport to=".event-panel">
      <Transition name="slide-in">
        <AddEvent
          v-if="editStateStore.isEdit"
          edit
          :edit-obj="editObj"
          @edit="edit"
          @cancel="cancelEdit"
        />
      </Transition>
    </teleport>
    <!-- update event panel ended -->
    <!-- add event btn -->
    <ElButton
      class="control-btn"
      type="success"
      size="large"
      :icon="Edit"
      @click="toadd"
    >
      新建
    </ElButton>
    <!-- add event btn ended -->
    <div class="content">
      <div class="category-list">
        <ElCollapse v-model="activeName" accordion>
          <ElCollapseItem name="1">
            <template #title>
              <img src="~@/assets/images/control-panel/warn_1.svg" />
              <span>存在: {{ event_1.length }}</span>
            </template>
            <Draggable :list="event_1" animation="300" item-key="id">
              <template #item="{ element }">
                <div
                  class="item"
                  :class="{
                    'item1-active':
                      element.id === currentEventStore.currentEvent.id
                  }"
                  @click="changeCurrent(element)"
                >
                  <span :title="element.name">{{ element.name }}</span>
                  <img
                    src="~@/assets/images/control-panel/edit.svg"
                    @click.stop="editEvent(element)"
                  />
                  <ElPopconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    title="删除这个指令?"
                    @confirm="del(element)"
                    @cancel="nodel"
                  >
                    <template #reference>
                      <img
                        src="~@/assets/images/control-panel/delete.svg"
                        @click.stop
                      />
                    </template>
                  </ElPopconfirm>
                </div>
              </template>
            </Draggable>
          </ElCollapseItem>
          <ElCollapseItem name="2">
            <template #title>
              <img src="~@/assets/images/control-panel/warn_2.svg" />
              <span>存在: {{ event_2.length }}</span>
            </template>
            <Draggable :list="event_2" animation="300" item-key="id">
              <template #item="{ element }">
                <div
                  class="item"
                  :class="{
                    'item2-active':
                      element.id === currentEventStore.currentEvent.id
                  }"
                  @click="changeCurrent(element)"
                >
                  <span :title="element.name">{{ element.name }}</span>
                  <img
                    src="~@/assets/images/control-panel/edit.svg"
                    @click.stop="editEvent(element)"
                  />
                  <ElPopconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    title="删除这个指令?"
                    @confirm="del(element)"
                    @cancel="nodel"
                  >
                    <template #reference>
                      <img
                        src="~@/assets/images/control-panel/delete.svg"
                        @click.stop
                      />
                    </template>
                  </ElPopconfirm>
                </div>
              </template>
            </Draggable>
          </ElCollapseItem>
          <ElCollapseItem name="3">
            <template #title>
              <img src="~@/assets/images/control-panel/warn_3.svg" />
              <span>存在: {{ event_3.length }}</span>
            </template>
            <Draggable :list="event_3" animation="300" item-key="id">
              <template #item="{ element }">
                <div
                  class="item"
                  :class="{
                    'item3-active':
                      element.id === currentEventStore.currentEvent.id
                  }"
                  @click="changeCurrent(element)"
                >
                  <span :title="element.name">{{ element.name }}</span>
                  <img
                    src="~@/assets/images/control-panel/edit.svg"
                    @click.stop="editEvent(element)"
                  />
                  <ElPopconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    title="删除这个指令?"
                    @confirm="del(element)"
                    @cancel="nodel"
                  >
                    <template #reference>
                      <img
                        src="~@/assets/images/control-panel/delete.svg"
                        @click.stop
                      />
                    </template>
                  </ElPopconfirm>
                </div>
              </template>
            </Draggable>
          </ElCollapseItem>
          <ElCollapseItem name="4">
            <template #title>
              <img src="~@/assets/images/control-panel/remind.svg" />
              <span>提醒事件: {{ remindStore.remind.length }}</span>
            </template>
            <Draggable :list="remindStore.remind" animation="300" item-key="id">
              <template #item="{ element }">
                <div class="item">
                  <div class="title" :title="element.name">
                    <span>提醒任务:{{ element.name }}</span>
                    <div>截止日期:{{ formatTime(element.time) }}</div>
                    <div>提前提醒时间:{{ element.abortTime }}分钟</div>
                  </div>
                  <ElPopconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    title="删除这个提醒?"
                    @confirm="delRemind(element.id)"
                    @cancel="nodel"
                  >
                    <template #reference>
                      <img
                        src="~@/assets/images/control-panel/delete.svg"
                        @click.stop
                      />
                    </template>
                  </ElPopconfirm>
                </div>
              </template>
            </Draggable>
          </ElCollapseItem>
        </ElCollapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ControlPanel'
}
</script>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import Draggable from 'vuedraggable'
import AddEvent from '@/components/AddEvent.vue'
import {
  useEventList,
  useCurrentEvent,
  useAddEventState,
  useEditState,
  useEventState,
  useRemind
} from '@/store'
import { Ref, ref } from 'vue'
import { EventItem } from '@/tools'
let editObj: Ref<EventItem | undefined> = ref(undefined)
const activeName: Ref<'1' | '2' | '3'> = ref('1')
const eventListStore = useEventList()
const {
  list: { event_1, event_2, event_3 }
} = eventListStore
const currentEventStore = useCurrentEvent()
const addEventStore = useAddEventState()
const editStateStore = useEditState()
const eventStateStore = useEventState()
const remindStore = useRemind()
// 开始添加
const toadd = () => {
  addEventStore.updateIsAdd()
}
// 确认添加
const add = (addEvent: any) => {
  eventListStore.addEvent(addEvent)
  addEventStore.updateIsAdd()
}
// 取消添加
const cancelAdd = () => {
  addEventStore.updateIsAdd()
}
// 开始编辑
const editEvent = (event: EventItem) => {
  if (
    currentEventStore.currentEvent.id === event.id &&
    eventStateStore.isStart
  ) {
    // 不可编辑当前正在执行的核心事件
    return ElMessage.error({
      message: '执行中...',
      duration: 1000
    })
  }
  editObj.value = event
  editStateStore.isEdit = true
}
// 确认编辑
const edit = (event: EventItem, originalType: 1 | 2 | 3) => {
  if (event.id === currentEventStore.currentEvent.id) {
    currentEventStore.updateCurrentEvent(event)
  }
  eventListStore.updateEvent(event, originalType)
  editStateStore.updateIsEdit()
}
// 取消编辑
const cancelEdit = () => {
  editStateStore.updateIsEdit()
}
// 修改当前主要事件
const changeCurrent = (event: EventItem) => {
  if (eventStateStore.isStart) {
    return ElMessage.warning({
      message: '请先暂停',
      duration: 1000
    })
  }
  if (event.id === currentEventStore.currentEvent.id) {
    return currentEventStore.resetCurrentEvent()
  }
  currentEventStore.updateCurrentEvent(event)
}
// 删除指令
const del = (event: EventItem) => {
  // 不可删除当前正在执行的核心事件
  if (
    event.id === currentEventStore.currentEvent.id &&
    eventStateStore.isStart
  ) {
    return ElMessage.error({
      message: '执行中...',
      duration: 1000
    })
  }
  if (event.id === currentEventStore.currentEvent.id) {
    // 如果删除的是核心事件，则清除核心事件store
    currentEventStore.resetCurrentEvent()
  }
  eventListStore.spliceList(event.type, event.id)
}
const nodel = () => {
  console.log('no del')
}
// 时间格式处理
const formatTime = (timeNumber: number) => {
  const date = new Date(timeNumber)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}
// 删除提醒
const delRemind = (id: number) => {
  remindStore.delRemind(id)
}
</script>

<style lang="less" scoped>
#control-panel {
  width: inherit;
  height: inherit;
  overflow: auto;
  .control-btn {
    display: block;
    margin: 10px auto;
    cursor: var(--cursor-url);
  }
  .content {
    background: #fff;
    .category-list {
      img {
        width: 30px;
        height: 30px;
        margin-right: 1em;
      }
      .item {
        margin: 10px 0;
        padding: 10px 0 10px 10px;
        background: var(--item-no-active-bg);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 0;
        .title {
          font-size: 12px;
        }
        span {
          width: 90%;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        img {
          display: block;
          width: 20px;
          height: 20px;
        }
      }
      .item1-active {
        background: var(--item-active-bg1);
      }
      .item2-active {
        background: var(--item-active-bg2);
      }
      .item3-active {
        background: var(--item-active-bg3);
      }
    }
  }
}
</style>
