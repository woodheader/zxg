import request from '@/utils/request'

// api地址
const api = {
  departmentList: 'wy.department/list',
  doComplaint: 'wy.complaint/doComplaint',
  complaintList: 'wy.complaint/complaintList',
  praiseList: 'wy.complaint/praiseList',
  adviceList: 'wy.complaint/adviceList',
  doPraise: 'wy.complaint/doPraise',
  doAdvice: 'wy.complaint/doAdvice',
	complaintDetail: 'wy.complaint/complaintDetail',
	praiseDetail: 'wy.complaint/praiseDetail',
	adviceDetail: 'wy.complaint/adviceDetail',
	doComment: 'wy.complaint/doComment'
}

// 部门列表
export const departmentList = (param) => {
  return request.post(api.departmentList, param)
}

// 投诉
export const doComplaint = (param) => {
  return request.post(api.doComplaint, param)
}

// 投诉评价
export const doComment = (param) => {
  return request.post(api.doComment, param)
}

// 投诉列表
export const complaintList = (param) => {
  return request.post(api.complaintList, param)
}

// 表扬列表
export const praiseList = (data) => {
  return request.post(api.praiseList, data)
}

// 投诉列表
export const adviceList = (data) => {
  return request.post(api.adviceList, data)
}

// 表扬 
export const doPraise = (data) => {
  return request.post(api.doPraise, data)
}

// 建议
export const doAdvice = (data) => {
  return request.post(api.doAdvice, data)
}

// 投诉详情
export const complaintDetail = (data) => {
  return request.post(api.complaintDetail, data)
}

// 表扬详情
export const praiseDetail = (data) => {
  return request.post(api.praiseDetail, data)
}

// 建议详情
export const adviceDetail = (data) => {
  return request.post(api.adviceDetail, data)
}
