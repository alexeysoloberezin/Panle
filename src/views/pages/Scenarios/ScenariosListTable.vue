<script setup>

import GlobalEvents, { EVENTS } from "@/js/utils/globalEvents";
import { STATUSES } from "@/js/statuses";
import { dateToString } from "../../../js/utils/ui/dateString";

const props = defineProps({
  items: [Array, Object],
  status: String,
  hideActions: Boolean,
  headers: [Array, Object]
})
const emit = defineEmits(['change:status', 'click:item'])
const router = useRouter()

const handleClick = (id) => {
  emit('click:item', id)
}

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
        :class="{active: item.type === 'api'}"
      >
        <td @click="handleClick(item.id)" v-if="isHeaderVisible('id')" class="base-table__td">
          {{ item.id }}
        </td>
        <td @click="handleClick(item.id)" v-if="isHeaderVisible('title')" class=" base-table__td">
          {{ item.title }}
        </td>
        <td @click="handleClick(item.id)" v-if="isHeaderVisible('createdAt')"
            class="base-table__td">
          {{ dateToString(item.createdAt) }}
        </td>
        <td class="text-end" v-if="!props.hideActions && isHeaderVisible('actions')">
          <div class="d-flex align-content-center">
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
          </div>
        </td>
      </tr>
    </v-slide-y-transition>
  </VTable>
</template>
