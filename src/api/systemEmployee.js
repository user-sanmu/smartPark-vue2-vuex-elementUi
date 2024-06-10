import axios from '@/utils/request'

export const getEmployeeListApi = params =>
  axios.get('/park/sys/user', { params })

export const addEmployeeApi = data => axios.post('/park/sys/user', data)

export const editEmployeeApi = data => axios.put('/park/sys/user', data)

export const delEmployeeApi = id => axios.delete(`/park/sys/user/${id}`)

export const resetPwdApi = data => axios.put('/park/sys/user/resetPwd', data)
