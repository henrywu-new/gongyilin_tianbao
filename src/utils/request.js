import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

function getResHeadersFileName(headers) {
  try {
    var regex = /filename=(.*)$/
    var result = headers['content-disposition'].match(regex)
    return decodeURIComponent(result[1])
  } catch (err) {
    return ''
  }
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 60 * 2 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    const { headers, request, data } = response

    // if the custom code is not 20000, it is judged as an error.
    if (request?.responseType === 'blob') {
      const blob = new Blob([data], {
        type: 'application/vnd.ms-word'
      })
      const filename = getResHeadersFileName(headers) || Date.now().toString() + '.docx'
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容IE10
        window.navigator.msSaveBlob(blob, filename)
      } else {
        //  兼容chrome/firefox
        const aTag = document.createElement('a')
        aTag.download = filename
        aTag.href = window.URL.createObjectURL(blob)
        aTag.click()
        URL.revokeObjectURL(aTag.href)
      }
      return Promise.resolve()
    } else if (res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.code === 10021 || res.code === 401) {
        // to re-login
        MessageBox.confirm('当前登陆已失效，请重新登陆', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: '服务器错误，请稍后重试！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
