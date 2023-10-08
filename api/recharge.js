import request from '@/utils/request'

// api地址
const api = {
  submit: 'recharge/submit'
}

// 积分明细列表
export const submit = (data) => {
  return request.post(api.submit, data)
}
