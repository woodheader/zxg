import request from '@/utils/request'

// api地址
const api = {
  carList: 'jjz/carList',
  carDetail: 'jjz/carDetail',
  carAdd: 'jjz/carAdd',
  carEdit: 'jjz/carEdit',
  carRemove: 'jjz/carRemove',
  carLogList: 'jjz/carLogList',
  carRePay: 'jjz/carRePay',
  carPrice: 'jjz/carPrice',
}

// 车辆价格


// 车辆列表
export const carList = (param) => {
  return request.get(api.carList, param)
}

// 车辆详情
export const carDetail = (carId) => {
  return request.get(api.carDetail, { carId })
}

// 新增车辆
export const carAdd = (data) => {
  return request.post(api.carAdd, { form: data })
}

// 编辑车辆
export const carEdit = (carId, data) => {
  return request.post(api.carEdit, { carId, form: data })
}

// 删除车辆
export const carRemove = (carId) => {
  return request.post(api.carRemove, { carId })
}

// 车辆日志列表
export const carLogList = (carId) => {
  return request.get(api.carLogList, {carId})
}

// 车辆续费
export const carRePay = (carId) => {
  return request.post(api.carRePay, { carId })
}
