export const isClearEventList = (date_1: number): boolean => {
  // date_1为事件列表更改的最后一次时间，如果是昨天或之前的时间，返回true表示清除事件列表，否则为今天的时间，不清除事件列表
  const beforeDay = new Date(date_1)
  const today = new Date()
  if (
    beforeDay.getFullYear() === today.getFullYear() &&
    beforeDay.getMonth() === today.getMonth() &&
    beforeDay.getDate() === today.getDate()
  ) {
    // 同年同月同日，返回false，不清除
    return false
  } else {
    // 返回true，清除
    return true
  }
}
