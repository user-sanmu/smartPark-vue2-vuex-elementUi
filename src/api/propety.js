import axios from '@/utils/request'

export const getBillDataApi = params =>
  axios.get('/park/propertyfee', { params })

export const getBillDetailApi = id => axios.get(`/park/propertyfee/${id}`)

export const delBillApi = id => axios.delete(`/park/propertyfee/${id}`)
