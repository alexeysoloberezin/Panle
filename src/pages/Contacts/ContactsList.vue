<script setup>
import AddContactsModal from "@/views/pages/Contacts/AddContactsModal.vue";
import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import {useContactsStore} from "@/store/contacts";
import ContactsListTable from "@/views/pages/Contacts/ContactsListTable.vue";
import {useToast} from "vue-toastification";
import AddContactListModal from "@/views/pages/Contacts/AddContactListModal.vue";
import {STATUSES} from "@/js/statuses";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";

const toast = useToast()
const route = useRoute();
const router = useRouter();
const storeContacts = useContactsStore()
const activeTab = ref(route.params.tab || 'active')
const pagination = computed(() => storeContacts.pagination)
const loading = computed(() => storeContacts.loading)

const isOpenAddContactsModal = ref(false)
const isOpenAddContactListModal = ref(false)
const currentList = ref(null)

onMounted(async () => {
  await loadContactsList()
})

const loadContactsList = async (params = {}) => {
  await storeContacts.loadContactsList({...params, status: activeTab.value, statusCall: params?.status})
}

const changeStatus = async ({id, status}) => {
  const res = await request.post(endpoints.contacts.CHANGE_STATUS_LIST, {id, status});
  if (res.status === 201) {
    await storeContacts.loadContactsList({status: activeTab.value})
  }
}

const changeTab = async () => {
  storeContacts.$reset()
  loadContactsList()
}

const handleChangeStatus = async (params) => {
  storeContacts.loading = true
  await changeStatus(params, status)
}

const contactsList = computed(() => storeContacts.getContactsListSorted)

const handleAddContactsInTable = (list) => {
  isOpenAddContactsModal.value = true
  currentList.value = list;
}

const handleClickContact = (id) => {
  router.push({name: 'contacts-view', params: {id}});
}
const headers = reactive(tableWrapperDefaultValues().contacts)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle>{{ $t('pages.contacts') }}</VCardTitle>
          <div
            class="d-flex gap-4 mt-3"
          >
            <VBtn type="button" @click.stop="isOpenAddContactListModal = true">
              {{ $t('actions.add') }}
            </VBtn>
          </div>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>

  <VTabs
    v-model="activeTab"
    show-arrows
    @update:modelValue="changeTab"
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
    v-if="contactsList"
    v-model="activeTab"
    class="mt-5 disable-tab-transition"
  >
    <!-- Account -->
    <VWindowItem value="active">
      <VRow>
        <VCol cols="12">
          <VCard class="card-visible">
            <TableWrapper :items="contactsList"
                          :lazy-pagination="true"
                          :lazy-options="pagination"
                          :loading="loading"
                          :show-type-filter="true"
                          :headers="headers" :status="STATUSES.ACTIVE"
                          :hide-fields="['status']"
                          :table-name="'contacts'"
                          @update:refreshTable="loadContactsList"
            >
              <!--              :sortBy="[{key: 'contactsCount', name: 'Кол. контактов'}]"-->

              <template #body="{ data }">
                <ContactsListTable
                  :items="data.items"
                  :headers="data.headers"
                  @change:status="handleChangeStatus"
                  @click:add-contacts="handleAddContactsInTable"
                  @click:item="handleClickContact"
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
            <TableWrapper :items="contactsList"
                          :lazy-pagination="true"
                          :lazy-options="pagination"
                          :loading="loading"
                          :status="STATUSES.ARCHIVE"
                          :hide-fields="['status']"
                          :show-type-filter="true"
                          :headers="headers"
                          @update:refreshTable="loadContactsList"
                          :table-name="'contacts'"
            >

              <template #body="{ data }">
                <ContactsListTable
                  :items="data.items"
                  :headers="data.headers"
                  @change:status="handleChangeStatus"
                />
              </template>
            </TableWrapper>
          </VCard>
        </VCol>
      </VRow>
    </VWindowItem>
  </VWindow>
  <AddContactListModal v-model="isOpenAddContactListModal" @contacts:added="loadContactsList"/>
  <AddContactsModal v-model="isOpenAddContactsModal" :list="currentList"/>
</template>
