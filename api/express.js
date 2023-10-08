import request from '@/utils/request'

// api地址
const api = {
  list: 'express/list'
}

// 物流公司列表
export const list = (param) => {
  return request.get(api.list, param)
}
