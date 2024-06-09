import axios from '@/utils/request'

export const getWorkbenchData = () => axios.get('/home/workbench/info')

export const computeFeesApi = data =>
  axios.post('/park/propertyfee/pre/payment', data)

export const addBillApi = data => axios.post('/park/propertyfee', data)
