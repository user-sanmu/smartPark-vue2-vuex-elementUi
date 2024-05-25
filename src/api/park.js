import axios from '@/utils/request'

export const getEnterPriseListApi = params =>
  axios.get('/park/enterprise', { params })

export const getIndustryListApi = () => axios.get('/park/industry')

export const addCompanyApi = data => axios.post('/park/enterprise', data)

export const checkCompanyApi = id => axios.get(`/park/enterprise/${id}`)

export const editCompanyApi = data => axios.put('/park/enterprise', data)

export const delCompanyApi = id => axios.delete(`/park/enterprise/${id}`)

export const getRentBuildingApi = () => axios.get('/park/rent/building')

export const addRentApi = data => axios.post('/park/enterprise/rent', data)

export const getEnterRentApi = id => axios.get(`/park/enterprise/rent/${id}`)

export const rentingOutApi = id => axios.put(`/park/enterprise/rent/${id}`)

export const delRentApi = id => axios.delete(`/park/enterprise/rent/${id}`)
