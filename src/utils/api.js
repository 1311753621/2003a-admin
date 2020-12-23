
import request from './request'
//get请求方式
export function gets (url,data) {
    return request.get(url,{
        params:data
    })
}
// post请求方式
export function posts (url,data) {
    return request.post(url,data)
}
// delete请求方式
export function deletes (url,data) {
    return request.delete(url,data)
}
// put请求方式
export function put (url,data) {
    return request.put(url,data)
}
// 当前城市请求地址接口
export function ajaxCity(type) {
    return gets(`/v1/cities?type=${type}`)
}

// 获取验证码
export function ajaxCode() {
    return posts(`/v1/captchas`)
}
// 登录
export function Login(data) {
    return posts(`/v2/login`,data)
}
//用户列表
export function UserList(data) {
    return gets(`/api/private/v1/users?query=${data.query}&pagenum=${data.pagenum}&pagesize=${data.pagesize}`)
}
//状态修改
export function ChangeState(uId,type) {
    return put(`/api/private/v1/users/${uId}/state/${type}`)
}
//用户添加
export function Add(obj) {
    return posts(`/api/private/v1/users`,obj)
}
//用户删除
export function Del(Id) {
    return deletes(`/api/private/v1/users/${Id}`)
}
//添加角色
export function Jueadd(obj) {
    return posts(`/api/private/v1/roles`,obj)
}
//角色删除
export function JueDel(Id) {
    return deletes(`/api/private/v1/roles/${Id}`)
}
//商品删除
export function ShopDel(Id) {
    return deletes(`/api/private/v1/goods/${Id}`)
}






















































