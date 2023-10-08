import request from '@/utils/request'

// api地址
const api = {
  list: 'points.log/list'
}

// 积分明细列表
export const list = (param) => {
  return request.get(api.list, param)
}
