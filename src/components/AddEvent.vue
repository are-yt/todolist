<template>
  <div class="add-todo">
    <div class="panel">
      <div class="item">
        <span>执行事件</span>
        <ElInput v-if="props.edit" class="input" v-model="name" autofocus />
        <ElInput
          v-else
          class="input"
          placeholder="执行事件名"
          v-model="event.name"
          autofocus
        />
      </div>
      <div class="item">
        <span>时长</span>
        <ElSlider
          v-if="props.edit"
          :disabled="isPositive"
          class="time-slider"
          v-model="time"
          size="small"
          :max="180"
          :min="1"
        />
        <ElSlider
          v-else
          :disabled="isPositive"
          class="time-slider"
          v-model="event.time"
          size="small"
          :max="180"
          :min="1"
        />
      </div>
      <div class="item">
        <span>事件类型</span>
        <div class="radios">
          <ElRadioGroup v-if="props.edit" v-model="type">
            <ElRadio :label="1">
              <img src="~@/assets/images/control-panel/warn_1.svg" />
            </ElRadio>
            <ElRadio :label="2">
              <img src="~@/assets/images/control-panel/warn_2.svg" />
            </ElRadio>
            <ElRadio :label="3">
              <img src="~@/assets/images/control-panel/warn_3.svg" />
            </ElRadio>
          </ElRadioGroup>
          <ElRadioGroup v-else v-model="event.type">
            <ElRadio :label="1">
              <img src="~@/assets/images/control-panel/warn_1.svg" />
            </ElRadio>
            <ElRadio :label="2">
              <img src="~@/assets/images/control-panel/warn_2.svg" />
            </ElRadio>
            <ElRadio :label="3">
              <img src="~@/assets/images/control-panel/warn_3.svg" />
            </ElRadio>
          </ElRadioGroup>
        </div>
      </div>
      <div class="item">
        <span>计时方式</span>
        <div class="radios">
          <ElCheckbox v-if="props.edit" v-model="isPositive">
            正向计时
          </ElCheckbox>
          <ElCheckbox v-else v-model="event.isPositive">正向计时</ElCheckbox>
        </div>
      </div>
      <div class="item">
        <ElButton class="btn" type="success" size="small" @click="add">
          {{ props.edit ? '修改' : '添加' }}
        </ElButton>
        <ElButton class="btn" type="danger" size="small" @click="cancel">
          取消
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, defineEmits, defineProps, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { EventItem } from '@/tools'
const props = defineProps<{
  edit?: boolean
  editObj?: EventItem
}>()
const id = ref(props.editObj?.id)
const name = ref(props.editObj?.name)
const time = ref(props.editObj?.time)
const originalType = ref(props.editObj?.type)
const type = ref(props.editObj?.type)
const isPositive = ref(props.editObj?.isPositive)
const positiveTime = ref(props.editObj?.positiveTime)

const event = reactive({
  name: '',
  time: 20,
  type: 1,
  isPositive: false,
  positiveTime: 0
})
const emits = defineEmits(['cancel', 'addto', 'edit'])
const add = () => {
  if (!name.value && props.edit) {
    return ElMessage.error({
      message: '指令: 错误',
      duration: 1000
    })
  }
  if (!event.name && !props.edit) {
    return ElMessage.error({
      message: '指令: 错误',
      duration: 1000
    })
  }
  if (props.edit && name.value) {
    // 修改事件
    const event = {
      id: id.value,
      name: name.value,
      time: time.value,
      type: type.value,
      isPositive: isPositive.value,
      positiveTime: positiveTime.value
    }
    emits('edit', event, originalType.value)
  }
  if (!props.edit && event.name) {
    emits('addto', event)
  }
}
const cancel = () => {
  emits('cancel')
}
</script>

<style scoped lang="less">
.add-todo {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--add-todo-zindex);
  font-size: 12px;
  .panel {
    position: absolute;
    top: 50%;
    left: 20%;
    right: 20%;
    transform: translateY(-50%);
    height: 60%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .item {
      width: 95%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 1em auto;
      .input,
      .time-slider,
      .radios {
        width: 80%;
      }
      .radios {
        display: flex;
        justify-content: space-around;
        img {
          width: 20px;
          height: 20px;
        }
      }
      span {
        flex: 1;
        text-align: center;
      }
      .btn {
        cursor: var(--cursor-url);
      }
    }
  }
}
</style>
