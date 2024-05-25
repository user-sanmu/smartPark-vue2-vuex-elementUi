import axios from '@/utils/request'

export const uploadFile = data => axios.post('/upload', data)
