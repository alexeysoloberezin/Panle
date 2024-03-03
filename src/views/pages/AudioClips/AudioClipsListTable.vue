<script setup>
import { STATUSES } from "@/js/statuses";
import { dateToString } from "@/js/utils/ui/dateString";
import AudioClipPlay from "@/components/AudioClips/AudioClipPlay.vue";
import GlobalEvents, { EVENTS } from "@/js/utils/globalEvents";
import { valuesSpeaker } from "@/js/audioClip";

const props = defineProps({
  items: [Array, Object],
  status: String,
  hideActions: Boolean,
  headers: [Array, Object]
})
const emit = defineEmits(['change:status', 'change:click'])

const handleChangeStatus = (data) => {
  GlobalEvents.emit(EVENTS.OPEN_CONFIRMATION, {
    callback() {
      emit('change:status', data)
    }
  })
}
const isHeaderVisible = (key) => {
  if(props.headers === undefined) return true;
  return props.headers.find(header => header.key === key)
}

</script>

<template>
  <VTable>
    <thead>
    <tr>
      <th v-for="head in headers" :key="head.key"
          style="text-align: start !important"
          :style="head.key === 'actions' ? 'width: 140px' : ''"
      >
        {{ head.name }}
      </th>
    </tr>
    </thead>

    <v-slide-y-transition :group="true" tag="tbody" :leave-absolute="true" :hide-on-leave="true" :duration="750">
      <tr
        v-for="(item, i) in items"
        :key="item.id"
        class="base-table__tr"
        @click="emit('change:click', item.id)"
      >
        <td  v-if="isHeaderVisible('id')" class="base-table__td">
          {{ item.id }}
        </td>
        <td v-if="isHeaderVisible('title')" class=" base-table__td">
          {{ item.title }}
        </td>
        <td v-if="isHeaderVisible('desc')" class=" base-table__td">
          <div>
            <VIcon icon="mdi-eye-outline"/>
            <VTooltip
              activator="parent"
              scroll-strategy="close"
            >
              <div>
                <div v-if="item.text">{{ item.text }}</div>
                <div v-else>{{ item.comment }}</div>
                <div>(Диктор/Голос: {{ valuesSpeaker[item.speaker] }}) </div>
              </div>
            </VTooltip>
          </div>
        </td>
        <td v-if="isHeaderVisible('createdAt')" class=" base-table__td">
          {{ dateToString(item.createdAt) }}
        </td>
        <td @click.stop class="base-table__td" v-if="isHeaderVisible('listen')">
          <AudioClipPlay class="mt-1" :id="item.id"/>
        </td>
        <td @click.stop class="text-center" v-if="!props.hideActions && isHeaderVisible('actions')">
          <VBtn
            icon
            size="x-small"
            width="25"
            height="25"
            :color="item.status === STATUSES.ACTIVE ? 'error' : 'success'"
            @click="handleChangeStatus({id: item.id, status: item.status === STATUSES.ACTIVE ? STATUSES.ARCHIVE: STATUSES.ACTIVE})"
          >
            <VIcon :icon="item.status === STATUSES.ACTIVE ? 'bx-trash' : 'mdi-reply'"/>
            <VTooltip
              activator="parent"
            >{{ item.status === STATUSES.ACTIVE ? $t('actions.inArchive') : $t('actions.restore') }}
            </VTooltip>
          </VBtn>
        </td>
      </tr>
    </v-slide-y-transition>
  </VTable>
</template>
