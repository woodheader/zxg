import { ACCESS_TOKEN, USER_ID } from '@/store/mutation-types'
import storage from '@/utils/storage'
import * as LoginApi from '@/api/login'

// 登陆成功后执行
const loginSuccess = (commit, { token, userId }) => {
  // 过期时间30天
  const expiryTime = 30 * 86400
  // 保存tokne和userId到缓存
  storage.set(USER_ID, userId, expiryTime)
  storage.set(ACCESS_TOKEN, token, expiryTime)
  // 记录到store全局变量
  commit('SET_TOKEN', token)
  commit('SET_USER_ID', userId)
}

const user = {
  state: {
    // 用户认证token
    token: '',
    // 用户ID
    userId: null
  },

  mutations: {
    SET_TOKEN: (state, value) => {
      state.token = value
    },
    SET_USER_ID: (state, value) => {
      state.userId = value
    }
  },

  actions: {

    // 用户登录(普通登录: 输入手机号和验证码)
    Login({ commit }, data) {
      return new Promise((resolve, reject) => {
        LoginApi.login({ form: data })
          .then(response => {
            const result = response.data
            loginSuccess(commit, result)
            resolve(response)
          })
          .catch(reject)
      })
    },

    // 微信小程序一键授权登录(获取用户基本信息)
    LoginMpWx({ commit }, data) {
      return new Promise((resolve, reject) => {
        LoginApi.loginMpWx({ form: data }, { isPrompt: false })
          .then(response => {
            const result = response.data
            loginSuccess(commit, result)
            resolve(response)
          })
          .catch(reject)
      })
    },

    // 微信小程序一键授权登录(授权手机号)
    LoginMpWxMobile({ commit }, data) {
      return new Promise((resolve, reject) => {
        LoginApi.loginMpWxMobile({ form: data }, { isPrompt: false })
          .then(response => {
            const result = response.data
            loginSuccess(commit, result)
            resolve(response)
          })
          .catch(reject)
      })
    },

    // 退出登录
    Logout({ commit }, data) {
      const store = this
      return new Promise((resolve, reject) => {
        if (store.getters.userId > 0) {
          // 删除缓存中的tokne和userId
          storage.remove(USER_ID)
          storage.remove(ACCESS_TOKEN)
          // 记录到store全局变量
          commit('SET_TOKEN', '')
          commit('SET_USER_ID', null)
          resolve()
        }
      })
    }

  }
}

export default user
