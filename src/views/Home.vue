<template>
  <div class="home">
    <el-container>
      <el-header>
        <div style="display:flex;">
          <img src="../assets/logo.png" alt="" />
          <p class="p-text">后台管理系统</p>
        </div>
        <el-button type="info" @click="goout" class="goout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="iscollapse ? '64px' : '200px'">
                    <div class="sg_kai" @click="sg_kai">
                        |||
                    </div>
                    <el-menu 
                    :default-active="activePath" 
                    :router="true" 
                    :collapse-transition="false" 
                    unique-opened :collapse="iscollapse" 
                    background-color="#545c64" 
                    text-color="#fff" 
                    active-text-color="#409EFF">                      
                        <el-submenu :index="item.id+''" v-for="(item,key) in menulist" :key="key">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{item.authName}}</span>                          
                            </template>
                        <el-menu-item :index="'/'+i.path" 
                        v-for="(i,k) in item.children" :key="k"
                        @click="saveNav('/'+i.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{i.authName}}</span>
                            </template>
                        </el-menu-item>                          
                        </el-submenu>                 
                    </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
        //左侧菜单
        menulist:[],
        //默认不展开
        iscollapse:false,
        //激活的路由地址
        activePath:''
    };
  },
  created() {

  },
  mounted() {
      this.sg_list()
      this.activePath=sessionStorage.getItem('activePath')
  },
  methods: {
      //退出登录
    goout() {
      this.$confirm('确定退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          sessionStorage.removeItem("sg_token")
          this.$router.push("/login");
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
    },
    //获取所有菜单
    async sg_list(){
        let {data:res} =await this.$http.get("menus")
        //console.log(res)
        if(res.meta.status!==200){
            this.$message.error(res.meta.msg)
        }else{
            this.menulist=res.data
           // console.log(this.menulist)
        }
    },
    //点击按钮展开菜单
    sg_kai(){
        this.iscollapse=!this.iscollapse
    },
    //保存路由的激活状态
    saveNav(activePath){
        sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
    }
  },
};
</script>
<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  background: red;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  line-height: 60px;
  color: #333;
  display: flex;
  justify-content: space-between;
  img {
    width: 50px;
    height: 50px;
    margin-top: 6px;
  }
  .p-text {
    font-size: 20px;
    font-weight: bold;
    margin-left: 30px;
    color: #fff;
  }
  .goout {
    margin-top: 10px;
    height: 40px;
  }
}
.el-aside {
 background-color: rgb(84, 92, 100);
  color: #333;
  .el-menu{
      border-right: none;
      background-color: none;
  }
  //展开按钮
  .sg_kai{
      height: 25px;
      line-height: 25px;
      text-align: center;
      color: #fff;
      font-size: 10px;
      letter-spacing: 0.2em;
      cursor: pointer;
       background: #4A5064;
    
  }
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>

