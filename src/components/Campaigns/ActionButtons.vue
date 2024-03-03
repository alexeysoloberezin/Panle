<script setup>
import { STATUSES, STATUSES_CALL } from "@/js/statuses";
import ButtonPause from "@/components/Buttons/ButtonPause.vue";
import ButtonInArchive from "@/components/Buttons/ButtonInArchive.vue";
import ButtonStart from "@/components/Buttons/ButtonStart.vue";
import GlobalEvents, { EVENTS } from "@/js/utils/globalEvents";
import CheckIcon from "@/components/Icons/CheckIcon.vue";
import ButtonStop from "@/components/Buttons/ButtonStop.vue";

const emit = defineEmits(['change:status', 'click:start-call', 'click:pause-call', 'click:stop-call'])
const props = defineProps({
  item: {
    type: Object
  },
  blockStart: {
    type: Boolean
  }
})
const handleStartCall = (id) => {
  if(props.blockStart){
    return null;
  }

  GlobalEvents.emit(EVENTS.OPEN_CONFIRMATION, {
    callback() {
      emit('click:start-call', id)
    }
  })
}

const handlePauseCall = (id) => {
  GlobalEvents.emit(EVENTS.OPEN_CONFIRMATION, {
    callback() {
      emit('click:pause-call', id)
    }
  })
}
const handleStopCall = (id) => {
  GlobalEvents.emit(EVENTS.OPEN_CONFIRMATION, {
    callback() {
      emit('click:stop-call', id)
    }
  })
}

const handleChangeStatus = (data) => {
  GlobalEvents.emit(EVENTS.OPEN_CONFIRMATION, {
    callback() {
      emit('change:status', data)
    }
  })
}

const isPause = computed(() => props.item.statusCall === STATUSES_CALL.PAUSE)
</script>


<template>
  <template v-if="props.item.status === STATUSES.ACTIVE">
    <ButtonStart
      v-if="[STATUSES_CALL.NOT_RUNNING, STATUSES_CALL.PAUSE, STATUSES_CALL.COMPLETED].includes(props.item.statusCall)"
      :tooltip-text="isPause ? $t('actions.restore') : $t('actions.launch')"
      :color="isPause ? 'primary': 'success'"
      :style="{pointerEvents: blockStart ? 'none' : '', opacity: blockStart ? '.15' : '1'}"
      @click="handleStartCall(props.item.id)"
    />
    <ButtonPause
      v-else
      tooltip-text="Поставить на паузу"
      @click="handlePauseCall(props.item.id)"
    />
    <ButtonStop
      v-if="[STATUSES_CALL.LAUNCHED, STATUSES_CALL.PAUSE, STATUSES_CALL.RESUMED].includes(props.item.statusCall)"
      tooltip-text="Остановить"
      @click="handleStopCall(props.item.id)"
    />
  </template>
  <ButtonInArchive
    :status="props.item.status"
    @click="handleChangeStatus({id: props.item.id, status: props.item.status === STATUSES.ACTIVE ? STATUSES.ARCHIVE: STATUSES.ACTIVE})"
  />
  <CheckIcon v-if="STATUSES_CALL.COMPLETED === props.item.statusCall" class="ml-3"/>
</template>
