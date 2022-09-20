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
  ElTooltip
} from 'element-plus'
import 'element-plus/dist/index.css'
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
  ElTooltip
]
export const globalCpns = (app: App): void => {
  components.forEach(item => {
    app.component(item.name, item)
  })
}
