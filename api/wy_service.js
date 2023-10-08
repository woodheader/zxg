import request from '@/utils/request'

// api地址
const api = {
  companyInfo: '/wy.service/companyInfo',
  ServiceList: '/wy.service/list',
  logList: '/wy.service/logList',
  logDetail: '/wy.service/logDetail',
  doScore: '/wy.service/doScore',
  scoreInfo: '/wy.service/scoreInfo',
  scoreHistoryList: '/wy.service/scoreHistoryList'
}

// 公司详情
export const companyInfo = (param) => {
  return request.post(api.companyInfo, param)
}

// 服务列表
export const ServiceList = (param) => {
  return request.post(api.ServiceList, param)
}

// 服务日志列表
export const logList = (param) => {
  return request.post(api.logList, param)
}

// 服务日志详情
export const logDetail = (data) => {
  return request.post(api.logDetail, {id:data})
}

// 用户评分
export const doScore = (data) => {
  return request.post(api.doScore, data)
}

// 评分详情
export const scoreInfo = (data) => {
  return request.post(api.scoreInfo, data)
}

// 历史评分
export const scoreHistoryList = (data) => {
  return request.post(api.scoreHistoryList, data)
}
