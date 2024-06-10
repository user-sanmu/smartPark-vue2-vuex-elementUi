import axios from '@/utils/request'

export const getRoleListApi = () => axios.get('/park/sys/role')

export const getAllPermissionListApi = () =>
  axios.get('/park/sys/permision/all/tree')

export const selectRolePermissionApi = roleId =>
  axios.get(`/park/sys/role/${roleId}`)

export const getRoleRelatedApi = (roleId, params) =>
  axios.get(`/park/sys/roleUser/${roleId}`, { params })

export const addRoleApi = data => axios.post('/park/sys/role', data)

export const editRolePermissionApi = data => axios.put('/park/sys/role', data)

export const delRoleApi = id => axios.delete(`/park/sys/role/${id}`)
