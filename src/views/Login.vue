<template>
  <div class="login">
    <div class="box">
      <div class="img-box">
          <img src="../assets/logo.png" alt="">
      </div>
      <el-form
        :model="Form"
        :rules="rules"
        ref="Form"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="Form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="Form.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-box">
          <el-button type="primary" @click="submitForm('Form')"
            >登录</el-button
          >
          <el-button type="info" @click="resetForm('Form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {Login} from '../utils/api'
export default {
  data() {
    return {
        Form:{
            username:'admin',
            password:'123456'   
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
          ],
           password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
          ],
        }
    };
  },
  created() {},
  mounted() {},
  methods: {
      //点击登录
       submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //请求数据
                        this.sg_Login()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                    });
                },
      //点击重置
      resetForm(formName){
           this.$refs[formName].resetFields();
      },
      //请求登录接口
      async sg_Login(){
          let {data} =await this.$http.post("/login",this.Form)
          //console.log(data)
            if(data.meta.status==200){
                //保存token
                sessionStorage.setItem('sg_token',data.data.token)
                this.$router.push("/home")
                this.$message({
                    message:data.meta.msg,
                    duration:1000,
                    type:"success"
                })
            }else{
                    this.$message({
                        message:data.meta.msg,
                        duration:1000,
                        type:"error"
                    })
                }
      }
  },
};
</script>
<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: #2b4b6b;
  position: relative;
  .box {
    width: 450px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }
}
.img-box {
  width: 130px;
  height: 130px;
  padding: 10px;
  border: 1px solid #efefef;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #efefef;
  }
}
.el-form {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btn-box {
  display: flex;
  justify-content: flex-end;
}
</style>
