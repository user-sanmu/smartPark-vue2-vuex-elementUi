import axios from '@/utils/request'

export const getCardListApi = params => {
  return axios.get('/parking/card/list', {
    params
  })
}

export const addCardApi = data => {
  return axios.post('/parking/card', data)
}

export const editCardDetailApi = id => {
  return axios.get(`/parking/card/detail/${id}`)
}

export const editCardApi = data => {
  return axios.put('/parking/card/edit', data)
}

export const delCardApi = id => {
  return axios.delete(`/parking/card/${id}`)
}

export const checkCardApi = id => {
  return axios.get(`/parking/card/${id}`)
}

export const renewCardApi = recharge => {
  return axios.post('/parking/card/recharge', recharge)
}
