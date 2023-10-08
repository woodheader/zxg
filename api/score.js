import request from '@/utils/request'

// api地址
const api = {
  GjInfo: 'gjUser/info',
  scoreTo: 'gjUser/doScore',
  detail: 'article/detail'
}

// 帮助中心列表
export const GjInfo = (param) => {
  return request.post(api.GjInfo, param)
}
export const scoreTo = (param) => {
  return request.post(api.scoreTo, param)
}
// 文章详情
export function detail(articleNo) {
  return request.get(api.detail, { articleNo })
}