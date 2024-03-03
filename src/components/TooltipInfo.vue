<script setup>
import {useTooltipStore} from "@/store/tooltipModern";

const props = defineProps({
  text: {
    type: [String, Number],
    default: '',
    required: false
  },
  html: {
    type: [String, Number],
    default: '',
    required: false
  },
  isModern: {
    type: Boolean,
    default: false
  },
  isModernId: {
    type: String,
    default: '',
  }
})

const tooltipStore = useTooltipStore()
const timer = ref(null)
const showToolTip = ref(false)
const tooltipAvalible = computed(() =>  tooltipStore.tooltips[props.isModernId] || null)

const progressPosition = ref(100);
const progressInterval = ref(null);

const options = {
  durationTooltip: 4000,
  step: 2 // 1,2,3,4
}

const setIntervalLeave = () => {
  progressInterval.value = setInterval(() => {
    if (showToolTip.value && progressPosition.value > options.step + 1) {
      progressPosition.value = progressPosition.value - options.step;
    }
  }, options.durationTooltip / (100 / options.step))
}

const handlerShow = () => {
  clearTooltipModal()

  tooltipStore.setTooltip(props.isModernId)
  showToolTip.value = true
  progressPosition.value = 100
}

const clearTooltipModal = () => {
  clearTimeout(timer.value)
  clearInterval(progressInterval.value)
  timer.value = null
  progressInterval.value = null
  showToolTip.value = false
  tooltipStore.resetMy(props.isModernId)
}

const handlerMouserLeave = () => {
  setIntervalLeave()
  timer.value = setTimeout(() => {
    clearTooltipModal()
  }, options.durationTooltip)
}

onMounted(() => {
  if(props.isModern) {
    if(!props.isModernId){
      console.error('Tooltip: isModernId is required')
    }
  }
})

onUnmounted(() => {
  clearTooltipModal()
});
</script>
<template>
  <div>
    <VBtn @mouseenter="handlerShow" @mouseleave="handlerMouserLeave" icon width="18" height="18" class="mr-2" size="x-small" color="secondary">
      <VIcon icon="bx-question-mark"/>
      <VTooltip
        v-if="!isModern"
        activator="parent"
      >
        <span v-if="props.html" v-html="props.html"/>
        <span v-else>{{ props.text }}</span>
      </VTooltip>
    </VBtn>
    <div v-if="isModern" class="text-xl pa-4 modernTooltip"
         @mouseenter="handlerShow" @mouseleave="handlerMouserLeave"
         :style="{bottom: '15px', right: showToolTip && tooltipAvalible ?  '15px' : '-500px'}"
         style=""
    >
      <div @click="clearTooltipModal" class="modernTooltip-close">
        <v-icon icon="mdi-close"/>
      </div>
      <slot name="modernTooltip">

      </slot>

      <v-progress-linear
        :model-value="progressPosition"
        color="primary"
        height="5"
        striped
      ></v-progress-linear>
    </div>
  </div>
</template>

<style lang="scss">


.modernTooltip {
  background: rgb(50, 50, 68);
  max-width: calc(100vw - 30px);
  border-radius: 10px;
  cursor: initial;
  position: fixed;
  width: 350px;
  height: fit-content;
  pointer-events: initial;
  z-index: 10000;
  box-shadow: 0 5px 25px rgba(42, 44, 143, 0.2);
  transition: .5s;

  h4,p,code{
    margin-bottom: 10px;
    line-height: 1.35;
    text-transform: initial;
    white-space: initial;
    color: #fff;
    text-align: left;
  }
  h4{
    font-size: 16px;
    font-weight: 500;
  }
  p{
    font-size: 15px;
    opacity: 0.9;
  }
  code{
    background: #2A2A3DFF;
    display: block;
    padding: 5px;
    font-size: 14px;
  }
  &-close{
    position: absolute;
    top: -30px;
    cursor: pointer;
    right: 2px;
    opacity: 0.7;
    transition: .2s;
    &:hover{
      opacity: 1;
      transform: rotate(90deg);
    }
  }
}
.v-theme--light{
  .modernTooltip{
    background: #fff;

    h4,p,code{
      color: #000;
    }
    code{
      background: rgba(105,108,255, 0.1);
    }
  }
}
</style>
