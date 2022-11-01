<template>
  <div class="footer">
    <ElTooltip placement="top" effect="light">
      <template #content>
        <span>新建: CTRL + N</span>
        <br />
        <span>切换左面板: CTRL + B</span>
        <br />
        <span>开始/暂停: CTRL + Space(统计页面无效)</span>
      </template>
      <img src="~@/assets/images/timer/kjj.svg" />
    </ElTooltip>
    <img
      src="~@/assets/images/timer/statistics.svg"
      @click="$router.push('/statistics')"
    />
    <img
      src="~@/assets/images/control-panel/remind-footer.svg"
      @click="emits('showRemindPanel')"
    />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'showRemindPanel'): void
}>()
</script>

<style scoped lang="less">
.footer {
  height: inherit;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: transform 0.5s linear;
  &:hover img {
    transform: scale(1.2);
  }
  img {
    width: 20px;
    height: 20px;
  }
}
</style>
