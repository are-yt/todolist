import type { App } from 'vue'
import {
  ElButton,
  ElCollapse,
  ElCollapseItem,
  ElInput,
  ElSlider,
  ElRadio,
  ElRadioGroup,
  ElCheckboxGroup,
  ElCheckbox,
  ElCarousel,
  ElCarouselItem,
  ElPopconfirm,
  ElTooltip,
  ElDatePicker
} from 'element-plus'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
const components = [
  ElButton,
  ElCollapse,
  ElCollapseItem,
  ElInput,
  ElSlider,
  ElRadio,
  ElRadioGroup,
  ElCheckboxGroup,
  ElCheckbox,
  ElCarousel,
  ElCarouselItem,
  ElPopconfirm,
  ElTooltip,
  ElDatePicker
]
export const globalCpns = (app: App): void => {
  app.use(ElementPlus, { locale })
  components.forEach(item => {
    app.component(item.name, item)
  })
}
