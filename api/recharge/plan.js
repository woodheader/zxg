import request from '@/utils/request'

// api地址
const api = {
  list: 'recharge.plan/list'
}

// 充值套餐列表
export const list = (param) => {
  return request.get(api.list, param)
}
