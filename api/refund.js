import request from '@/utils/request'

// api地址
const api = {
  list: 'refund/list',
  goods: 'refund/goods',
  apply: 'refund/apply',
  detail: 'refund/detail',
  delivery: 'refund/delivery'
}

// 售后单列表
export const list = (param, option) => {
  return request.get(api.list, param, option)
}

// 订单商品详情
export const goods = (orderGoodsId, param) => {
  return request.get(api.goods, { orderGoodsId, ...param })
}

// 申请售后
export const apply = (orderGoodsId, data) => {
  return request.post(api.apply, { orderGoodsId, form: data })
}

// 售后单详情
export const detail = (orderRefundId, param) => {
  return request.get(api.detail, { orderRefundId, ...param })
}

// 用户发货
export const delivery = (orderRefundId, data) => {
  return request.post(api.delivery, { orderRefundId, form: data })
}
