import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import { baseURL } from './config'

// 创建axios实例
const service = axios.create({
    baseURL: baseURL,
    timeout: 50000, // 请求超时时间
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
            //loading
        let loading = Loading.service({
            lock: true,
            fullscreen: true,
            text: '加载中...',
            background: 'rgba(0,0,0,0.2)'
        });
        return config
    },
    error => {
        console.log(error)
        let loading = Loading.service({});
        loading.close();
        Promise.reject(error)
    }
)

//response拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) { // 后台返回码，根据自己的业务进行修改
            Message({
                    showClose: true,
                    message: '错误：' + res.message, //错误描述信息
                    type: 'error'
                })
                //return Promise.reject('error')
        } else {
            let loading = Loading.service({});
            loading.close();
            return response.data
        }
    },
    error => {
        console.log('error:' + error) //for debug
        Message({
            showClose: true,
            message: '错误：' + error,
            type: 'error'
        })
        return Promise.reject(error)
    }
)

export default service