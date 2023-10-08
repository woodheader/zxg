import request from '@/utils/request'

// api地址
const api = {
  notifyList: 'interact/notifyList',
  voteList: 'interact/voteList',
  activityList: 'interact/activityList',
  detail: 'interact/detail',
  doVote: 'interact/doVote',
  doApply: 'interact/doApply',
}

// 通知列表
export const notifyList = (param) => {
  return request.post(api.notifyList, param)
}

// 投票列表
export const voteList = (param) => {
  return request.post(api.voteList, param)
}

// 活动列表
export const activityList = (param) => {
  return request.post(api.activityList, param)
}

// 详情
export const details = (param) => {
  return request.post(api.detail, param)
}

// 进行投票
export const doVote = (param) => {
  return request.post(api.doVote, param)
}

// 进行报名
export const doApply = (param) => {
  return request.post(api.doApply, param)
}