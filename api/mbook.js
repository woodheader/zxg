import request from '@/utils/request'

// api地址
const api = {
  list: 'mbook/list',
}

// 电话本列表
export const list = (param) => {
  return request.post(api.list, param)
}
