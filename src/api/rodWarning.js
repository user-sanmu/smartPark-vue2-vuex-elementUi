import axios from '@/utils/request'

export const getWarningListApi = params =>
  axios.get('/pole/warning/list', { params })

export const getDetailWarningApi = id => axios.get(`/pole/warning/${id}`)

export const sendWarningApi = data => axios.put('/pole/warning/send', data)
