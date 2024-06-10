import axios from '@/utils/request'

export const getRuleListApi = params =>
  axios.get('/parking/rule/list', { params })

export const addRuleApi = data => axios.post('/parking/rule', data)

export const editRuleApi = data => axios.put('/parking/rule', data)

export const getRuleDetailApi = id => axios.get(`/parking/rule/${id}`)

export const delRuleApi = id => axios.delete(`/parking/rule/${id}`)
