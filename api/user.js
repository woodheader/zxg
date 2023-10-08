import request from '@/utils/request'

// api地址
const api = {
  userInfo: 'user/info',
  assets: 'user/assets',
  bindMobile: 'user/bindMobile',
  personal: 'user/personal',
  billPay: 'bill/pay',
  billList: 'bill/getBillList',
  bill: 'bill/getPayList',
  historyPayList: 'bill/getHistoryPayList',
  getBillById: 'bill/getBillById',
  addFamilyMember: 'yzUser/addFamilyMember',
  // getFamilyMember: 'yzUser/getFamilyMember',
  delFamilyMember: 'yzUser/delFamilyMember',
  getWyUserInfo: 'user.house/list'  ,//获取业主下得房间信息
  getYzUser: 'user.house/memberList'  ,//获取该房间有多少家庭成员
  removeMember: 'user.house/removeMember'  ,//删除绑定租户
  delUser: 'user/delUser'  ,//注销用户
  pointsList: 'points.log/list', //知珠明细
  notifyMsgDoRead: 'notifyMessage/doRead', // 消息通知已读
	addMember: 'user.house/addMember',// 添加成员
	editMember: 'user.house/editMember',// 编辑成员
}

// 当前登录的用户信息
export const info = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.userInfo, param, options)
}

// 账户资产
export const assets = (param, option) => {
  return request.get(api.assets, param, option)
}

// 绑定手机号
export const bindMobile = (data, option) => {
  return request.post(api.bindMobile, data, option)
}

// 修改个人信息（头像昵称）
export const personal = (data, option) => {
  return request.post(api.personal, data, option)
}

// 支付账单
export const billPay = (data, option) => {
	return request.post(api.billPay, data, option)
}

//获取账单
export const billList = (data, option) => {
	return request.post(api.billList, data, option)
}

//获取未缴费账单
export const bill = (data, option) => {
	return request.post(api.bill, data, option)
}

//获取历史账单
export const historyPayList = (data) => {
	return request.post(api.historyPayList, data)
}

//根据缴费id查询订单
export const getBillById = (billId) => {
	return request.post(api.getBillById, {billId})
}

//新增家庭成员
export const addFamilyMember = (data) => {
	return request.post(api.addFamilyMember, data)
}

//查询家庭成员列表
export const getFamilyMember = (data) => {
	return request.post(api.getFamilyMember,data )
}

//根据成员id删除订单
export const delFamilyMember = (data) => {
	return request.post(api.delFamilyMember, data)
}

//获取业主下得房间信息
export const getWyUserInfo = (data) => {
	return request.post(api.getWyUserInfo, data)
}

//获取该房间有多少家庭成员
export const getYzUser = (data) => {
	return request.post(api.getYzUser, data)
}

//业主添加房间
export const removeMember = (data) => {
	return request.post(api.removeMember, data)
}

//注销用户
export const delUser = (data) => {
	return request.post(api.delUser, data)
}

//注销用户
export const pointsList = (data) => {
	return request.post(api.pointsList, data)
}

// 通知消息已读
export const doRead = (data) => {
	return request.post(api.notifyMsgDoRead, data)
}

// 添加成员
export const addMember = (data) => {
	return request.post(api.addMember, data)
}

// 编辑成员
export const editMember = (data) => {
	return request.post(api.editMember, data)
}