import axios from '@/utils/request'

export const getCarPayListApi = params =>
  axios.get('/parking/payment/list', { params })
