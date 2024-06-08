import axios from 'axios'
import { useTestStore } from '@/store/user'
import { useUtilStore } from '../store/util'
// import { withMemo } from 'vue'

let service = axios.create({
  timeout: 25000,//超时时间'
  baseURL: process.env.NODE_ENV === "production" ? useUtilStore().post_url : "/api"
  // 在发送请求之前做些什么
})


/**
 * 请求接口前，做一些数据处理（请求拦截器）
 */
service.interceptors.request.use(
  function (config) {
    // console.log(process.env.NODE_ENV)
    // console.log(process.env)
    // console.log(process.env.VUE_APP_API_HOST)
    // console.log(useTestStore().refresh_token)
    // console.log(useUtilStroe().post_url)
    console.log(config)
    // config.baseURL = process.env.NODE_ENV === "production" ? useUtilStroe().post_url : "/api"
    console.log(config.url)
    if (config.url == '/uploadimg/') {
      config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'
    } 
     // suntone接口为音频文件上传
    else if (config.url == '/suntone/') {
      config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'}
    else {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }

    if (config.url == '/refreshtoken/') {
      config.headers['Authorization'] = 'Bearer ' + useTestStore().refresh_token
    } else {
      config.headers['Authorization'] = 'Bearer ' + useTestStore().access_token
    }
    console.log(useTestStore().access_token)
    return config;
  },
  function (error) {
    // 对请求错误做些什么

    return Promise.reject(error);
  })
/**
* 请求接口后，返回数据进行拦截（响应拦截器）
*/
service.interceptors.response.use(
  function (response) {
    console.log(response)
    // 对响应数据做点什么
    let data = response.data;
    // 业务需求

    if (data.code !== 0) {
      errorMsg(data)
      console.log(data.msg)
      return Promise.reject(data);
    } else {
      console.log('成功 !!!')
      return Promise.resolve(data);
    }
  },
  function (err) {
    // 对响应错误做点什么
    console.log(err)
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log('错误请求')
          break;
        case 401:
          ElMessage.error('未授权，请重新登录')
          console.log('未授权，请重新登录')
          setTimeout(() => {
            window.location = '/login'
          }, 1000)

          break;
        case 403:
          console.log('拒绝访问')
          break;
        case 404:
          console.log('请求错误,未找到该资源')
          break;
        case 405:
          console.log('请求方法未允许')
          break;
        case 408:
          console.log('请求超时')
          break;
        case 500:
          console.log('服务器端出错')
          break;
        case 501:
          console.log('网络未实现')
          break;
        case 502:
          console.log('网络错误')
          break;
        case 503:
          console.log('服务不可用')
          break;
        case 504:
          console.log('网络超时')
          break;
        case 505:
          console.log('http版本不支持该请求')
          break;
        default:
          console.log(`连接错误${err.response.status}`)
      }
    } else {
      console.log('连接到服务器失败')
    }
    return Promise.reject(err);
  }
);
function errorMsg (data) {
  // alert(data)
  console.log(data)
  let title = "提示"
  let content = data.msg + '!'
  if (data.code == -1) {
    content = '服务器错误！'
  }

  console.log(content)
  ElMessageBox.alert(
    content,
    '提示',
    {
      confirmButtonText: '确定',
      type: 'warning',
    }
  )
    .then(() => {

    })

  // Modal.error({
  //   title: title,
  //   content: content,
  //   okText: '确定',
  //   onOk () {
  //     if (data.code == 10006 || data.code == 10005 || data.code == 20002) {
  //       localStorage.clear();
  //       removeAll()
  //       getConfig("login")
  //     }
  //   },
  // });

}

export default service;