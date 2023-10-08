import request from '@/utils/request'

// api地址
const api = {
  list: 'life.service/list'
}

// 商品评价列表
export function list(lifeId) {
  return request.get(api.list, { lifeId })
}
