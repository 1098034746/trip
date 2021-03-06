import axios from 'axios'

import { stringify } from 'qs'
import { Toast } from 'mand-mobile'
import store from '../store/index'

let tmpTrip = store.state.trip

axios.defaults.timeout = 10000
axios.defaults.withCredentials = false
// 表示跨域请求是是否使用凭证， 默认否

// 请求拦截
axios.interceptors.request.use(
  config => {
    // 每次请求前判断 vuex 中是否存在 DOMSettableTokenList
    // 如果存在 则统一请求的 header 都加上 token, 这样后台就能根据 token 判断你的登录状态
    // 即使本地存在token , 也可能是过期的, 所以要在响应拦截器中对返回的状态进行判断
    config.header['Content-type'] = 'application/x-www-form-urlencoded'
    return config
  },
  error => {
    Toast.failed('请求过程出错...')
    return Promise.error(error)
  }
)

// 添加响应拦截
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  Toast.failed('响应过程出错')
  return Promise.reject(error)
})

var request = (options) => {
  // 每次请求都带上当前用户ID
  if (tmpTrip.user) {
    if (options.body) {
      options.body.userId = tmpTrip.user.userId
    }
    if (options.params) {
      options.params.userId = tmpTrip.user.userId
    }
  }
  // 表单传值 参数格式化
  return axios.request({
    url: `http://localhost:3000${options.url}`,
    method: options.method,
    data: options.data,
    params: options.data
  }).then(response => {
    return response
  }, err => {
    Toast.failed(err.message)
    throw err
  }).catch((error) => {
    Toast.failed('请求失败')
    throw error
  })
}

// http 请求方式
export const http = {}

const methods = ['get', 'post', 'put', 'delete']
methods.forEach(method => {
  http[method] = (url, params = {}) => {
    if (method === 'get') {
      return request({
        url,
        params,
        method
      })
    }
    return request({
      url,
      body: stringify(params),
      method
    })
  }
})

export default function plugin (Vue) {
  if (plugin.installed) {
    return
  }
  plugin.installed = true
  Object.defineProperties(Vue.prototype, {
    // 该方法 直接作用在一个对象上 定义新的属性 或 修改现有属性 并返回新对象
    $http: {
      get () {
        const obj = {
          get: http['get'],
          post: http['post'],
          put: http['put'],
          delete: http['delete']
        }
        return obj
      }
    }
  })
}
