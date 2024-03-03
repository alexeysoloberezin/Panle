<script setup>
import {dateToString} from "@/js/utils/ui/dateString";
import ActionButtons from "@/components/Campaigns/ActionButtons.vue";

const props = defineProps({
  items: [Array, Object],
  status: String,
  hideActions: Boolean,
  headers: [Array, Object]
})
const emit = defineEmits(['change:status', 'click:start-call', 'click:item', 'click:pause-call', 'click:stop-call'])
const router = useRouter()

const handleClick = (id) => {
  emit('click:item', id)
}


const isHeaderVisible = (key) => {
  if (props.headers === undefined) return true;
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

    <v-slide-y-transition v-if="Array.isArray(items)" :group="true" tag="tbody" :leave-absolute="true" :hide-on-leave="true" :duration="750">
        <tr
          v-for="(item, i) in items"
          :key="item.id"
          class="base-table__tr"
          :class="{active: item.type === 'api'}"
          @click="handleClick(item.id)"
        >
          <td v-if="isHeaderVisible('id')" class="base-table__td">
            {{ item.id }}
          </td>
          <td v-if="isHeaderVisible('limit')" class="base-table__td">
            {{ item.limit }}
          </td>
          <td v-if="isHeaderVisible('title')" class=" base-table__td">
            {{ item.title }}
          </td>
          <td v-if="isHeaderVisible('createdAt')"
              class=" base-table__td">
            {{ dateToString(item.createdAt) }}
          </td>
          <td v-if="isHeaderVisible('statusCall')"
              class=" base-table__td">
            {{ $t('STATUSES_CALL_NAMES.' + item.statusCall) }}
          </td>
          <td @click.stop v-if="!props.hideActions && isHeaderVisible('actions')">
            <div class="d-flex align-content-center">
              <ActionButtons
                :item="item"
                :blockStart="!item.contactsList"
                @change:status="emit('change:status', $event)"
                @click:start-call="emit('click:start-call', $event)"
                @click:pause-call="emit('click:pause-call', $event)"
                @click:stop-call="emit('click:stop-call', $event)"
              />
            </div>
          </td>
        </tr>
    </v-slide-y-transition>
  </VTable>
</template>
