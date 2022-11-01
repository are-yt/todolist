<template>
  <div class="wrapper">
    <div class="panel">
      <span class="desc">
        在提醒时间段内，如果插件没被运行(如电脑电源-睡眠模式或插件被关闭)，无法发送提醒
      </span>
      <span class="desc">
        提醒邮件可能会被当作垃圾邮件处理，建议下载qq邮箱软件
      </span>
      <div class="item">
        <span>截止日期前多久提醒(分)</span>
        <ElSlider
          v-model="abortTime"
          class="slider"
          :min="5"
          :max="120"
          size="small"
        ></ElSlider>
      </div>
      <div class="item">
        <span>提醒事件</span>
        <ElInput
          v-model="event"
          class="input"
          type="text"
          placeholder="提醒事件"
        />
      </div>
      <div class="item">
        <span>选择截止日期</span>
        <ElDatePicker
          v-model="datetime"
          type="datetime"
          class="input"
          placeholder="选择日期"
          @change="getDatetime"
        />
      </div>
      <div class="item">
        <span>验证邮箱</span>
        <ElInput v-model="email" type="text" class="input" placeholder="邮箱" />
      </div>
      <div class="item">
        <ElInput
          v-model="code"
          type="text"
          class="input"
          placeholder="验证码"
        />
        <span class="right" @click="send">{{ text }}</span>
      </div>
      <div class="btns">
        <ElButton type="success" size="small" class="btn" @click="cancel">
          取消
        </ElButton>
        <ElButton type="success" size="small" class="btn" @click="add">
          添加
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRemind } from '@/store'
import { emailRequest } from '@/request'
const datetime = ref('')
const abortTime = ref(10)
const event = ref('')
let time = 0
const email = ref('')
const code = ref('')
let sendCode = ''
const text = ref<number | string>('发送')
const emits = defineEmits<{
  (e: 'hide'): void
}>()
const getDatetime = (val: any) => {
  if (!val) {
    return
  }
  const leastTime = 1000 * 60 * abortTime.value
  const set_time = val.getTime()
  const now = new Date().getTime()
  if (set_time - now <= 0) {
    // 选择了一个过去的时间
    return ElMessage.warning({ message: '选择了一个过去的时间！' })
  } else if (set_time - now <= leastTime) {
    // 选择的时间已在提前提醒时间段内
    return ElMessage.warning({ message: '截止日期已在设定的提前提醒时间段内' })
  }
  // 保存设置的截止日期时间戳
  time = val.getTime()
}
const add = () => {
  const emailReg = /^[A-Za-z0-9_-]+@qq\.com$/
  if (!event.value.trim()) {
    return ElMessage.warning({ message: '提醒事件名称格式有误~' })
  } else if (!time) {
    return ElMessage.warning({ message: '截止日期选择失败' })
  } else if (sendCode !== code.value || sendCode.length != 6) {
    return ElMessage.warning({ message: '验证码错误' })
  } else if (emailReg.test(email.value) === false) {
    return ElMessage.warning({ message: '邮箱格式错误' })
  }
  // 验证成功后持久化提醒事件
  useRemind().addRemind(event.value, abortTime.value, time, email.value)
  // 输入数据清理，退出添加
  abortTime.value = 10
  event.value = ''
  time = 0
  emits('hide')
  sendCode = ''
}
const cancel = () => {
  emits('hide')
  sendCode = ''
}
// 发送验证码验证邮箱
const send = () => {
  sendCode = ''
  if (typeof text.value === 'number') {
    return false
  } else if (!email.value.trim()) {
    return ElMessage.warning({ message: '邮箱格式不对' })
  }
  for (let i = 0; i < 6; i++) {
    sendCode += Math.floor(Math.random() * 10)
  }
  emailRequest
    .request({
      url: `/qq.php?user=2821458718@qq.com&password=bmmbredqjpyydcga&email=${email.value}&bt=邮箱验证&nr=验证码: ${sendCode}`,
      method: 'GET'
    })
    .then(res => {
      if (res.data !== '发送成功！') {
        return ElMessage.success({ message: res.data })
      }
      // 发送成功
      text.value = 60
      let interval = setInterval(() => {
        if (text.value === 0) {
          text.value = '重新发送'
          clearInterval(interval)
        } else {
          ;(text.value as number)--
        }
      }, 1000)
    })
}
</script>

<style scoped lang="less">
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #00000050;
  background-position: 0 50%;
  background-size: 400%;
  animation: toggle 10s linear infinite;
  z-index: 10;
  .panel {
    position: absolute;
    left: 20%;
    right: 20%;
    top: 50%;
    padding: 20px;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 10px;
    .desc {
      margin: 20px 0;
      text-align: center;
      font-size: 12px;
    }
    .item {
      margin: 1rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      span {
        flex: 1;
      }
      span.right {
        text-align: center;
      }
      .input {
        width: 80%;
      }
      .slider {
        width: 70%;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-around;
    .btn {
      display: block;
      margin: 2rem auto 0 auto;
    }
  }
}
</style>
