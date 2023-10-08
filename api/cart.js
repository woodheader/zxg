import request from '@/utils/request'

// api地址
const api = {
  list: 'cart/list',
  total: 'cart/total',
  add: 'cart/add',
  update: 'cart/update',
  clear: 'cart/clear',
  addLife: 'cart/add',
  updateLife: 'cart/update',
}

// 购物车列表
export const list = () => {
  return request.get(api.list, {}, { load: false })
}

// 购物车商品总数量
export const total = () => {
  return request.get(api.total, {}, { load: false })
}

// 加入购物车
export const add = (goodsId, goodsSkuId, goodsNum, dataType, serveTime) => {
  if (dataType === undefined || dataType === null) {
    dataType = 1
  }
  return request.post(api.add, { goodsId, goodsSkuId, goodsNum, dataType, serveTime})
}

// 更新购物车商品数量
export const update = (goodsId, goodsSkuId, goodsNum, dataType) => {
  if (dataType === undefined || dataType === null) {
    dataType = 1
  }
  return request.post(api.update, { goodsId, goodsSkuId, goodsNum, dataType }, { isPrompt: false })
}

// 删除购物车中指定记录
export const clear = (cartIds = []) => {
  return request.post(api.clear, { cartIds })
}
