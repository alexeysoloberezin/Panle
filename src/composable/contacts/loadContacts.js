import { useContactsStore } from "@/store/contacts";

const storeContacts = useContactsStore()

export const loadContactsList = async () => {
    await storeContacts.loadContactsList()
}
