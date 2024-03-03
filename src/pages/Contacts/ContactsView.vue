<script setup>
import { useToast } from "vue-toastification";
import ContactsTable from "@/views/pages/Contacts/ContactsTable.vue";
import AddContactsModal from "@/views/pages/Contacts/AddContactsModal.vue";
import { useContactsStore } from "@/store/contacts";
import Loader from "@/components/Loader.vue";
import TableWrapper from "@/components/Table/TableWrapper.vue";

const props = defineProps(['contact_id'])
const emit = defineEmits(['update:save'])

const toast = useToast()
const route = useRoute();
const router = useRouter();
const storeContacts = useContactsStore()
const contactList = ref(null)
const isOpenAddContactsModal = ref(false)
const isLoading = ref(true)

const contact_id  = props?.contact_id || route.params.id
const isModal = !!props?.contact_id

const viewList = computed(() => storeContacts.viewList)

const loadList = async () => {
  try {
    await storeContacts.loadList(contact_id)
    contactList.value = storeContacts.getContactsList[contact_id];
  } catch (error) {
    if (error?.status === 404) {
      router.push({ name: 'contacts' })
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadList();
  await loadListById();
})

const loadListById = (params) => {
  storeContacts.loadListById({
    id: contact_id,
    params: params || {page: 1}
  })
}

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem v-if="contactList">
          <VCardTitle class="mb-5">{{ $t('pages.contact') }} - {{ contactList?.title }}
          </VCardTitle>
          <div class="d-flex justify-space-between flex-wrap">
            <VBtn class="mb-5 mr-1" type="button" @click.stop="isOpenAddContactsModal = true">
              {{ $t('actions.add') }}
            </VBtn>
          </div>
          <div v-if="!isLoading">
            <TableWrapper
              :items="viewList?.entities"
              :lazy-pagination="true"
              :lazy-options="{ perPage: viewList.perPage, count: viewList.count }"
              :hide-fields="[ 'date', 'status', 'sortBy', 'fieldsTable']"
              :loading="viewList.loading"
              :search-label="'Введите номер для поиска'"
              :headers="[]"
              @update:refreshTable="loadListById"
              :table-name="'contactsBase'"
            >
              <template
                #body="{ data }"
              >
                <ContactsTable
                  :show-search="false"
                  :items="data.items"
                />
              </template>
            </TableWrapper>
<!--            <ContactsTable :items="viewList?.entities"/>-->
          </div>
          <Loader v-else :show="true"/>
        </VCardItem>
        <Loader v-else :show="true"/>
      </VCard>
    </VCol>
  </VRow>
  <AddContactsModal v-model="isOpenAddContactsModal" :list="contactList" @contacts:added="loadList"/>
</template>
