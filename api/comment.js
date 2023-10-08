import request from '@/utils/request'

// api地址
const api = {
  list: 'comment/list',
  listRows: 'comment/listRows',
  total: 'comment/total'
}

// 商品评价列表
export const list = (goodsId, param, option) => {
  return request.get(api.list, { ...param, goodsId }, option)
}

// 商品评价列表 (限制数量, 用于商品详情页展示)
export const listRows = (goodsId, limit = 5) => {
  return request.get(api.listRows, { goodsId, limit })
}

// 商品评分总数
export const total = (goodsId) => {
  return request.get(api.total, { goodsId })
}
