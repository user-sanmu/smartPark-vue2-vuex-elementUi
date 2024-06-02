import axios from '@/utils/request'

export const getCarAreaListApi = params =>
  axios.get('/parking/area/list', { params })

export const getCarAreaSelectApi = () => axios.get('/parking/rule/dropList')

export const addCarAreaApi = data => axios.post('/parking/area', data)

export const editCarAreaApi = data => axios.put('/parking/area', data)

export const delCarAreaApi = id => axios.delete(`/parking/area/${id}`)
