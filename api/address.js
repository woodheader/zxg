import request from '@/utils/request'

// api地址
const api = {
  list: 'address/list',
  defaultId: 'address/defaultId',
  detail: 'address/detail',
  add: 'address/add',
  edit: 'address/edit',
  setDefault: 'address/setDefault',
  remove: 'address/remove'
}

// 收货地址列表
export const list = (param) => {
  return request.get(api.list, param)
}

// 默认收货地址ID
export const defaultId = (param) => {
  return request.get(api.defaultId, param)
}

// 收货地址详情
export const detail = (addressId) => {
  return request.get(api.detail, { addressId })
}

// 新增收货地址
export const add = (data) => {
  return request.post(api.add, { form: data })
}

// 编辑收货地址
export const edit = (addressId, data) => {
  return request.post(api.edit, { addressId, form: data })
}

// 设置默认收货地址
export const setDefault = (addressId) => {
  return request.post(api.setDefault, { addressId })
}

// 删除收货地址
export const remove = (addressId) => {
  return request.post(api.remove, { addressId })
}
