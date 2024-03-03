export const useTooltipStore = defineStore('tooltipStore', () => {
  const tooltips = ref({})

  const setTooltip = (id) => {
    resetAll()

    tooltips.value[id] = true
  }

  const resetMy = (id) => {
    tooltips.value[id] = false
  }

  const resetAll = () => {
    const keys = Object.keys(tooltips.value)

    keys.forEach(key => {
      tooltips.value[key] = false
    })
  }

  return { tooltips, setTooltip, resetAll, resetMy }
})
