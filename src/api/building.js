import axios from '@/utils/request'

export const getBuildingListApi = params =>
  axios.get('/park/building', { params })

export const addBuildingApi = data => axios.post('/park/building', data)

export const editBuildingApi = data => axios.put('/park/building', data)

export const getBuildingdetail = id => axios.get(`/park/building/${id}`)

export const delBuildingApi = id => axios.delete(`/park/building/${id}`)
