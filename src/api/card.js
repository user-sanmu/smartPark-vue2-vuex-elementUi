import axios from '@/utils/request'

export const getCardListApi = params => {
  return axios.get('/parking/card/list', {
    params
  })
}

export const addCardApi = data => axios.post('/parking/card', data)

export const editCardDetailApi = id => axios.get(`/parking/card/detail/${id}`)

export const editCardApi = data => axios.put('/parking/card/edit', data)

export const delCardApi = id => axios.delete(`/parking/card/${id}`)

export const checkCardApi = id => axios.get(`/parking/card/${id}`)

export const renewCardApi = recharge =>
  axios.post('/parking/card/recharge', recharge)
