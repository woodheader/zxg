import request from '@/utils/request'

// api地址
const api = {
  image: 'captcha/image',
  sendSmsCaptcha: 'captcha/sendSmsCaptcha'
}

// 图形验证码
export function image() {
  return request.get(api.image, {}, { load: false })
}

// 发送短信验证码
export function sendSmsCaptcha(data) {
  return request.post(api.sendSmsCaptcha, data, { load: false })
}
