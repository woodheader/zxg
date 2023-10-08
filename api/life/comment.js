import request from '@/utils/request'

// api地址
const api = {
  list: 'life.comment/list',
  listRows: 'life.comment/listRows',
  total: 'life.comment/total'
}

// 商品评价列表
export const list = (lifeId, param, option) => {
  return request.get(api.list, { ...param, lifeId }, option)
}

// 商品评价列表 (限制数量, 用于商品详情页展示)
export const listRows = (lifeId, limit = 5) => {
  return request.get(api.listRows, { lifeId, limit })
}

// 商品评分总数
export const total = (lifeId) => {
  return request.get(api.total, { lifeId })
}
