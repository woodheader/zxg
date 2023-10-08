import Config from '@/core/config'
import storage from '@/utils/storage'
import * as SettingApi from '@/api/setting'

const CACHE_KEY = 'Setting'
const OTHER = '_other'

// 写入缓存, 到期时间10分钟
const setStorage = (data) => {
  const expireTime = 10 * 60
  storage.set(CACHE_KEY, data, expireTime)
}

// 获取缓存中的数据
const getStorage = () => {
  return storage.get(CACHE_KEY)
}

// 获取后端接口商城设置 (最新)
const getApiData = () => {
  return new Promise((resolve, reject) => {
    SettingApi.data()
      .then(result => {
        resolve(result.data.setting)
      })
  })
}

/**
 * 获取商城设置
 * 有缓存的情况下返回缓存, 没有缓存从后端api获取
 * @param {bool} isCache 是否从缓存中获取 [优点不用每次请求后端api 缺点后台更新设置后需等待时效性]
 */
const data = isCache => {
  if (isCache == undefined) {
    isCache = Config.get('enabledSettingCache')
  }
  return new Promise((resolve, reject) => {
    const cacheData = getStorage()
    if (isCache && cacheData) {
      resolve(cacheData)
    } else {
      getApiData()
        .then(data => {
          setStorage(data)
          resolve(data)
        })
    }
  })
}

// 获取商城设置(指定项)
const item = (key, isCache) => {
  return new Promise((resolve, reject) => {
    data(isCache)
      .then(setting => {
        resolve(setting[key])
      })
  })
}

// 获取H5端访问地址
const h5Url = (isCache = false) => {
  return new Promise((resolve, reject) => {
    data(isCache)
      .then(setting => {
        const h5Url = setting[OTHER]['h5Url']
        resolve(h5Url)
      })
  })
}

export default {
  data,
  item,
  h5Url
}
