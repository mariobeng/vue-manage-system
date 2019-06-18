import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { baseURL } from './config'

// 创建axios实例
const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
Vue.config.productionTip = false;
Vue.prototype.instance = instance;

export default instance