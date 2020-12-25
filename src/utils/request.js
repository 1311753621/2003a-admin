import axios from 'axios'
import router from '../router'
//引入loading的加载服务
import { Loading } from "element-ui"
//axios.defaults.withCredentials = true; //配置为true
const server = axios.create({
    baseURL:"https://www.liulongbin.top:8888/api/private/v1",
    timeout:"5000"
})
// //创建loading加载
// const loading = {
//     loadingService: null,
//     //开启loading加载
//     open() {
//         if (this.loadingService == null) {
//             this.loadingService = Loading.service({
//                 target: ".main",
//                 text: "拼命加载中......",
//                 background: "rgba(0,0,0,0.5)"
//             })
//         }
//     },
//     //关闭loading加载
//     close() {
//         if(this.loadingService != null){
//             this.loadingService.close();
//         }
//         this.loadingService = null;
//     }
// };
// 请求拦截器
server.interceptors.request.use((config)=>{  
               // loading.open();
                //读取sessionStorage中的数据  然后添加到请求头中
                const token = sessionStorage.getItem('sg_token')
                if(token){
                //为请求头对象添加token验证的Authorization字段
                    config.headers.Authorization = token
                }
                return config    
   
},error=>{
   // loading.close();
    return Promise.reject(error)
})
// 响应拦截器
server.interceptors.response.use((res)=>{
    //console.log(res)
   // loading.close();
    if(res.data.meta.status==401){
        sessionStorage.removeItem("sg_token")
        router.push('/')
    }
    return res
},error=>{
   // loading.close();
    return Promise.reject(error)
})  
export default server