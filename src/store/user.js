import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { roles } from "@/js/roles";
import { preventMultipleUse } from "@/js/utils/helpers";


export const useUserStore = defineStore('user', () => {
    const user = reactive({});

    const getBalance = computed(() => user.balance || 0)

    const getUserApiKey = computed(() => {
        return user?.apiKey || ''
    })

    const isAdmin = computed(() => {
        let storeRoles = localStorage.getItem('roles')
        storeRoles = storeRoles ? JSON.parse(storeRoles) : null

        if (Array.isArray(user?.roles)) {
            return user.roles.includes(roles.ADMIN)
        }

        if (Array.isArray(storeRoles)) {
            return storeRoles.includes(roles.ADMIN)
        }

        return null
    })

    const getUser = computed(() => {
        return user;
    })

    const setUser = (newUser = {}) => {
        localStorage.setItem('roles', JSON.stringify(newUser.roles));
        for (const key in newUser) {
            user[key] = newUser[key];
        }
    }

    const clearUser = () => {
        const localKeys = ['roles', 'campaigns-fields', 'roles', 'statistic-fields', 'audio-fields', 'contacts-fields', 'scenarios-fields']

        localKeys.forEach(key => localStorage.removeItem(key))

        for (const key in setUser) {
            delete setUser[key];
        }
    }

    const loadUserInfo = async () => {
        await preventMultipleUse(loadUserInfo, async () => {
            try {
                const res = await request.get(endpoints.users.INFO)
                localStorage.setItem('roles', JSON.stringify(res.data.roles));

                for (const key in res.data) {
                    user[key] = res.data[key];
                }
            } catch (e) {
                console.error('e', e)
            }
        })
    }

    return { user, setUser, getUser, clearUser, getUserApiKey, loadUserInfo, isAdmin, getBalance }
})
