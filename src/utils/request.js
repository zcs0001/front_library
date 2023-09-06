import axios from 'axios'
import router from '@/router'
import Cookies from 'js-cookie'

const request = axios.create({
    // 后台接口使用拦截器加了一个api接口，因此前端也要加
    baseURL: 'http://localhost:9090/api',
    timeout: 5000
})

// request 拦截器,特别强调：只有在发生请求之后，才会走到这个部分，这段代码才会起限制作用
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // 请求的拦截，在没有登录的情况下跳转到登陆界面
    // if (!admin) {
    //     router.push("/login")
    // }
    // 从Cookie中获取token,作为请求头的一部分，因为后端会从请求头中取token，只有有token，一些请求才会生效
    const adminJson = Cookies.get('admin')
    if (adminJson) {
        // 设置请求头
        // token应该放在Cookie中，在下一次请求的时候能够拿到token
        config.headers['token'] = JSON.parse(adminJson).token
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        if (res.code === '401') {
            router.push('/login')
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request