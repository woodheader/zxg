import request from '@/utils/request'

// api地址
const api = {
  data: 'setting/data'
}

// 设置项详情
export function data() {
  return request.get(api.data)
}
