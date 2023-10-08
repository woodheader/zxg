import request from '@/utils/request'

// api地址
const api = {
  list: 'recharge.order/list'
}

// 我的充值记录列表
export const list = (param) => {
  return request.get(api.list, param)
}
