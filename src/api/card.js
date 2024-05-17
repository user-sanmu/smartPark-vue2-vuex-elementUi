import axios from '@/utils/request'

/**
 * 获取月卡列表
 * @param {*} params 参数
 * @returns
 */
export const getCardListApi = params => {
  return axios.get('https://api-hmzs.itheima.net/v1/parking/card/list', {
    params
  })
}
