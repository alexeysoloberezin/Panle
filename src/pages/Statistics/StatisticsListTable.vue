<script setup>
import {CALL_DIRECTION} from "@/js/call";
import { dateToString } from "@/js/utils/ui/dateString";
import AudioClipPlay from "@/components/AudioClips/AudioClipPlay.vue";
import {useCampaignStore} from "@/store/campaign";

const props = defineProps({
  items: [Array, Object],
  status: String,
  hideActions: Boolean,
  headers: [Array, Object]
})
const emit = defineEmits(['change:status', 'click:start-call', 'click:add-contacts', 'click:item'])
const router = useRouter()
const storeCampaign = useCampaignStore()
const campaignIds = computed(() => storeCampaign.campaignIds)

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
      >
        <td v-if="isHeaderVisible('id')" class="base-table__td">
          {{ item.id }}
        </td>
        <td v-if="isHeaderVisible('createdAt')"
            class=" base-table__td">
          {{ dateToString(item.createdAt) }}
        </td>

        <td v-if="isHeaderVisible('direction')" class=" base-table__td">
          {{ CALL_DIRECTION[item.direction] || item.direction }}
        </td>

        <td v-if="isHeaderVisible('phone')" class=" base-table__td">
          {{ item.phone }}
        </td>

        <td v-if="isHeaderVisible('duration')" class=" base-table__td">
          {{ item.duration }} {{ $t('form.sec') }}
        </td>
        <td  v-if="isHeaderVisible('cost')" class=" base-table__td">
          {{ item.cost }}
        </td>
        <td v-if="isHeaderVisible('campaign')" class=" base-table__td">
          {{ campaignIds[item.campaign] || item.campaign || '-' }}
        </td>
        <td  v-if="isHeaderVisible('audio_recording')" class=" base-table__td">
          <AudioClipPlay v-if="item.audio_recording" class="mt-1" :type="'record'" :path="item.audio_recording"/>
          <div v-else>-</div>
        </td>
      </tr>
    </v-slide-y-transition>
  </VTable>
</template>
