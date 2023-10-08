import request from '@/utils/request'

// api地址
const api = {
  todoCounts: 'lifeOrder/todoCounts',
  list: 'lifeOrder/list',
  detail: 'lifeOrder/detail',
  express: 'lifeOrder/express',
  cancel: 'lifeOrder/cancel',
  receipt: 'lifeOrder/receipt',
  pay: 'lifeOrder/pay',
  remove: 'lifeOrder/remove',
  supOrderList: 'lifeOrder/supOrderList',
  shangmen: 'lifeOrder/shangmen'
}

// 当前用户待处理的订单数量
export function todoCounts(param, option) {
  return request.get(api.todoCounts, param, option)
}

// 我的订单列表
export function list(param, option) {
  return request.get(api.list, param, option)
}

// 订单详情
export function detail(orderId, param) {
  return request.get(api.detail, { orderId, ...param })
}

// 获取物流信息
export function express(orderId, param) {
  return request.get(api.express, { orderId, ...param })
}

// 取消订单
export function cancel(orderId, data) {
  return request.post(api.cancel, { orderId, ...data })
}

// 确认收货
export function receipt(orderId, data) {
  return request.post(api.receipt, { orderId, ...data })
}

// 立即支付
export function pay(orderId, payType, param) {
  return request.get(api.pay, { orderId, payType, ...param })
}

// 删除
export function remove(orderId) {
  return request.get(api.remove, { orderId })
}

// 师傅待上门订单列表
export function supOrderList(param, option) {
  return request.get(api.supOrderList, param, option)
}

// 上门
export function shangmen(orderId) {
  return request.get(api.shangmen, { orderId })
}
