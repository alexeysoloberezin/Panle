import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import {useToast} from "vue-toastification";


export const usePriceStore = defineStore('priceStore', () => {
  const price = ref(null);
  const defaultPrice = ref(null);
  const clients = ref(null);
  const toast = useToast()

  const getPrice = async () => {
    try {
      const res = await request.get(endpoints.users.GET_PRICE)
      if(res.status === 200){
        price.value = res.data
      }
    }catch (err){
      console.log('err', err)
    }
  }

  const getDefaultPrice = async () => {
    try {
      const res = await request.get(endpoints.users.GET_DEF_PRICE)
      if(res.status === 200){
        defaultPrice.value = res.data.value
      }
    }catch (err){
      console.log('err', err)
    }
  }

  const getClients = async () => {
    try {
      const res = await request.get(endpoints.users.GET_CLIENTS)
      if(res.status === 200){
        clients.value = res.data
      }
    }catch (err){
      console.log('err', err)
    }
  }

  const getUserPrice = async (userId) => {
    try {
      const res = await request.get(endpoints.users.GET_USER_PRICE(userId))
      if(res.status === 200){
        price.value = res.data.value
      }
    }catch (err){
      console.log('err', err)
    }
  }

  const setPrice = async ({userId, data}) => {
    try {
      const res = await request.post(endpoints.users.SET_PRICE(userId), {
        ...data,
        personalPrice: true
      })
      if(res.status === 200){
        toast.success('Персональная цена успешно установлена')
      }
    }catch (err){
      console.log('err', err)
    }
  }

  const setDefaultPrice = async (data) => {
    try {
      const res = await request.post(endpoints.users.SET_DEF_PRICE, data)
      if(res.status === 200){
        toast.success('Стандартная цена успешно изменена')
      }
    }catch (err){
      console.log('err', err)
    }
  }

  return { price, getPrice, clients,defaultPrice, getClients, getUserPrice,getDefaultPrice, setPrice , setDefaultPrice }
})
