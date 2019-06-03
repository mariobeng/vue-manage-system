import axios from 'axios'
import qs from 'qs'
import { Notification } from 'element-ui'
import { baseURL } from './config'

// 创建axios实例
const service = axios.create({
    baseURL: baseURL,
    timeout: 5000, // 请求超时时间
    transformRequest: [function(data) {
        data = qs.stringify(data);
        return data;
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

//request拦截器
service.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded' //关键所在
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)

//response拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) { // 后台返回码，根据自己的业务进行修改
            console.log("01");
            Notification.error({
                title: '错误',
                message: res.message, //错误描述信息
                duration: 0
            })
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('error:' + error) //for debug
        console.log("02");
        Notification.error({
            title: '错误',
            message: error,
            duration: 0
        })
        return Promise.reject(error)
    }
)

export default service