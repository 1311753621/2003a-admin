import request from './request'
  //验证邮箱的规则
export function Email (rule,value,callback){
    //邮箱正则
     return  email=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          //验证邮箱
          if(email.test(value)){
             callback();
          }else{
            callback(new Error('请输入正确的邮箱'));
          }        
}
 //验证手机号的规则
export function Mobile (rule,value,callback){
    return phone=/^1[3456789]\d{9}$/ 
         //验证邮箱
         if(phone.test(value)){
            callback();
         }else{
           callback(new Error('请输入正确的手机号'));
         }      
}