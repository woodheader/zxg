import request from '@/utils/request'

// api地址
const apiUri = {
  detail: 'page/detail',
  notices: 'page/notices',
	newList: 'wy.message/list',
	indexList: 'goods/indexList',
	lifeList: 'life.life/indexList'
}

// 页面数据
export function detail(pageId) {
  return request.get(apiUri.detail, {
    pageId
  })
}

// 页面数据
export function notices(params) {
  return request.get(apiUri.notices, {params: params})
}

// 最新消息
export function newList(data) {
  return request.post(apiUri.newList, data)
}
// 优选商品
export function indexList(data) {
  return request.post(apiUri.indexList, data)
}
// 上门服务
export function lifeList(data) {
  return request.post(apiUri.lifeList, data)
}
