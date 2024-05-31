import axios from '@/utils/request'

export const getRuleListApi = params =>
  axios.get('/parking/rule/list', { params })

export const addRuleApi = data => axios.post('/parking/rule', data)
