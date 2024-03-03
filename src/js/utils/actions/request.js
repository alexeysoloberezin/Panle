import axios from "axios";
import { useUserStore } from "@/store/user";
import router from '../../../router';
import { getErrorMessage } from "@/js/utils/helpers";
import { useToast } from "vue-toastification";

const toast = useToast()
const request = axios.create({
    baseURL: import.meta.env.VITE_HOST,
    withCredentials: true,
})

request.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401 && router.currentRoute.value.name !== 'login') {
        const userStore = useUserStore()
        userStore.clearUser();
        document.cookie = "token=; Max-Age=0"
        router.push({ name: 'login' })
    }
    const errorMessage = getErrorMessage(error);
    if (Array.isArray(errorMessage)) {
        errorMessage.forEach(errorItem => {
            toast.error(errorItem)
        })
    } else {
        toast.error(errorMessage)
    }
    return Promise.reject(error.response);
});

export { request }
