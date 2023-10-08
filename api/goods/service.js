import request from '@/utils/request'

// api地址
const api = {
  list: 'goods.service/list'
}

// 商品评价列表
export function list(goodsId) {
  return request.get(api.list, { goodsId })
}
