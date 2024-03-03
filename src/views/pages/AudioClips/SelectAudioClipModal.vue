<script setup>
import { initToggle } from "@/composable/toggle";
import AudioClipsListTable from "@/views/pages/AudioClips/AudioClipsListTable.vue";
import { useAudioClipsStore } from "@/store/audioClips";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";

const props = defineProps({
  value: {
    type: Boolean
  }
})
const emit = defineEmits(['update:modelValue', 'audioclips:selected'])
const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})
onMounted(() => {
  loadAudioClips();
})
const storeAudioClips = useAudioClipsStore()
const pagination = computed(() => storeAudioClips.pagination)
const loading = computed(() => storeAudioClips.loading)
// Functions

const loadAudioClips = async (params = {}) => {
  await storeAudioClips.loadAudioClips({...params, status: 'active'})
}

const handleSelectAudio = (id) => {
  emit('audioclips:selected', id)
  isOpen.value = false;
}
const headers = reactive(tableWrapperDefaultValues().headersSmall)
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="auto">
    <VCard>
      <VCardTitle>{{ $t('data.helpers.chooseAudio') }}</VCardTitle>
      <VCardText>
        <VRow>
          <TableWrapper :items="storeAudioClips.getAudioClipsSorted"
                        :lazy-pagination="true"
                        :lazy-options="pagination"
                        :hide-fields="['search', 'date', 'status', 'sortBy', 'fieldsTable']"
                        :loading="loading"
                        @update:refreshTable="loadAudioClips"
                        :headers="headers"
                        :table-name="'AudioClipModal'"
          >
            <template #body="{ data }">
              <AudioClipsListTable
                :items="data.items"
                :headers="data.headers"
                @change:click="handleSelectAudio"
              />
            </template>
          </TableWrapper>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">

</style>
