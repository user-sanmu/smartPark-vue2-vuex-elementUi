import axios from '@/utils/request'

export const getAndSearchRodApi = params =>
  axios.get('/pole/info/list', { params })

export const addRodApi = data => axios.post('/pole/info', data)

export const getAreaDropListApi = () => axios.get('/parking/area/dropList')

export const editRodApi = data => axios.put('/pole/info', data)

export const delRodApi = ids => axios.delete(`/pole/info/${ids}`)
