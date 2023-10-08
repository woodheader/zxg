import request from '@/utils/request'

// api地址
const api = {
  list: 'life.life/list',
  detail: 'life.life/detail',
  specData: 'life.life/specData',
  treeList: 'life.life/treeList',
}

// 商品列表
export const list = param => {
  return request.get(api.list, param)
}

// 商品详情
export const detail = lifeId => {
  return request.get(api.detail, { lifeId })
}

// 获取商品规格数据
export const specData = (lifeId) => {
  return request.get(api.specData, { lifeId })
}

// 服务列表 - 按分类
export const treeList = param => {
  return request.get(api.treeList, param)
}
