import request from '@/utils/request'

// api地址
const api = {
  list: 'goods/list',
  detail: 'goods/detail',
  specData: 'goods/specData'
}

// 商品列表
export const list = param => {
  return request.get(api.list, param)
}

// 商品详情
export const detail = goodsId => {
  return request.get(api.detail, { goodsId })
}

// 获取商品规格数据
export const specData = (goodsId) => {
  return request.get(api.specData, { goodsId })
}
