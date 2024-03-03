<script setup>
import AddAudioClips from "@/views/pages/AudioClips/AddAudioClipsModal.vue";
import { useAudioClipsStore } from "@/store/audioClips";
import AudioClipsListTable from "@/views/pages/AudioClips/AudioClipsListTable.vue";
import { STATUSES } from "@/js/statuses";
import { loadAudioClips } from "@/composable/audioClips/loadAudioClips.js";
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const toast = useToast()
const route = useRoute();
const storeAudioClips = useAudioClipsStore()
const pagination = computed(() => storeAudioClips.pagination)
const loading = computed(() => storeAudioClips.loading)

const activeTab = ref(route.params.tab || 'active')
const isOpenAddAudioModal = ref(false)
const router = useRouter()

onMounted(async () => {
  await loadAudioClipsMiddleWare()
})
// Functions
const changeStatus = async ({ id, status }) => {
  const res = await request.post(endpoints.audioClips.CHANGE_STATUS, { id, status });
  if (res.status === 201) {
    await loadAudioClipsMiddleWare();
  }
}

const changeTab = () => {
  storeAudioClips.$reset()
  loadAudioClipsMiddleWare()
}

const loadAudioClipsMiddleWare = (params = {}) => {
  loadAudioClips({...params, status: activeTab.value})
}

const changeRoute = (id) => {
  router.push({ name: 'audioclips-change', params: { id } });
}

const audioClips = computed(() => storeAudioClips.getAudioClipsSorted)
const {t} = useI18n()
const headers = reactive( [
  {
    name: t('table.id'),
    key: 'id',
  },
  {
    name: t('table.title'),
    key: 'title',
    classes: 'text-center'
  },
  {
    name: t('table.desc'),
    key: 'desc',
  },
  {
    name: t('table.createdAt'),
    key: 'createdAt',
  },
  {
    name: t('table.audio_recording'),
    key: 'listen',
  },
  {
    name: t('table.actions'),
    key: 'actions',
  },
])
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle>{{ $t('pages.audioClips') }}</VCardTitle>
          <div
            class="d-flex gap-4 mt-3"
          >
            <VBtn type="button" @click.stop="isOpenAddAudioModal = true">
              {{ $t('actions.add') }}
            </VBtn>
          </div>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>

  <VTabs
    v-model="activeTab"
    @update:modelValue="changeTab"
    show-arrows
    class="mt-10"
  >
    <VTab
      value="active"
    >
      {{ $t('tabs.active') }}
    </VTab>
    <VTab
      value="archive"
    >
      {{ $t('tabs.archive') }}
    </VTab>
  </VTabs>
  <VDivider/>
  <VWindow
    v-if="audioClips"
    v-model="activeTab"
    class="mt-5 disable-tab-transition"
  >
    <!-- Account -->
    <VWindowItem value="active">
      <VRow>
        <VCol cols="12">
          <VCard class="card-visible">
            <TableWrapper
              :items="audioClips"
              :status="STATUSES.ACTIVE"
              :lazy-pagination="true"
              :lazy-options="pagination"
              :loading="loading"
              :headers="headers"
              :hide-fields="['status']"
              :table-name="'audio'"
              @update:refreshTable="loadAudioClipsMiddleWare"
            >
              <template #body="{ data }">
                <AudioClipsListTable
                  :items="data.items"
                  :headers="data.headers"
                  @change:status="changeStatus"
                  @change:click="changeRoute"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>

    <!-- Security -->
    <VWindowItem value="archive">
      <VRow>
        <VCol cols="12">
          <VCard>
            <TableWrapper :items="audioClips"
                          :status="STATUSES.ARCHIVE"
                          :headers="headers"
                          :hide-fields="['status']"
                          :table-name="'audio'"
                          :lazy-pagination="true"
                          :lazy-options="pagination"
                          :loading="loading"
                          @update:refreshTable="loadAudioClipsMiddleWare"
            >
              <template #body="{ data }">
                <AudioClipsListTable
                  :items="data.items"
                  :headers="data.headers"
                  @change:status="changeStatus"
                  @change:click="changeRoute"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
  </VWindow>
  <AddAudioClips
    v-model="isOpenAddAudioModal"
    @audioclips:added="loadAudioClips"
  />
</template>
