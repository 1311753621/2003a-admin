<template>
    <div class="users">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item> 
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输入内容" clearable @clear="userslist" v-model="info.query">
                        <el-button @click="userslist()" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                     <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表表格 -->
            <el-table :data="ulist" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>              
                <el-table-column label="电话" prop="mobile"></el-table-column>              
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="change(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content=" 编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
                        </el-tooltip>
                         <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                             <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)"></el-button>
                        </el-tooltip>
                         <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="role(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="info.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="info.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            <!-- 添加用户的对话框 -->
            <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addClose"
                >
                <el-form :model="addform" :rules="formRules" ref="fromRef" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addform.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addform.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addform.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addform.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="adduser">确 定</el-button>
                </span>
                </el-dialog>
            <!-- 编辑用户的对话框 -->
            <el-dialog
                title="修改用户"
                :visible.sync="editdialogVisible"
                width="50%"
                @close="editClose"
                >
                <el-form :model="editform" :rules="editformRules" ref="editfromRef" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editform.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editform.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editform.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="edituserinfo">确 定</el-button>
                </span>
                </el-dialog>
                 <!-- 分配角色的对话框 -->
            <el-dialog
                title="分配角色"
                :visible.sync="roledialogVisible"
                width="50%"
                >
                <div>
                    <p>当前的用户：{{userinfo.username}}</p>
                    <p>当前的角色：{{userinfo.role_name}}</p>
                    <p>分配新角色：
                         <el-select v-model="selectroleid" placeholder="请选择">
                            <el-option
                            v-for="item in rolelist"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id" 
                            @close="roleClose" >
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="roledialogVisible=false">取 消</el-button>
                    <el-button type="primary" @click="roleinfo()">确 定</el-button>
                </span>
                </el-dialog>
        </el-card>
    </div>
</template>

<script>
import {Email,Mobile} from '@/utils/http'
export default {
    data() {
        return {
            info:{
                query:'',
                //当前页数
                pagenum:1,
                //当前每页显示多少条数据
                pagesize:2,
            },
            ulist:[],
            total:0,
            dialogVisible:false, //添加对话框的显示与隐藏
            editdialogVisible:false,//编辑对话框的显示与隐藏
            addform:{  //添加用户
                    username:'',
                    password:'',
                    email:'',
                    mobile:'',
            },
            //查询到的用户信息
            editform:{

            },

            formRules:{  // 添加用户效验
                username:[
                   { required:true,message:'请输入用户名',trigger:'blur'},
                   { min:3,max:10,message:'用户名的长度在3-10个字符之间',trigger:'blur'}
                ],
                password:[
                   { required:true,message:'请输入密码',trigger:'blur'},
                   { min:6,max:15,message:'密码的长度在3-10个字符之间',trigger:'blur'}
                ],
                email:[
                   { required:true,message:'请输入邮箱',trigger:'blur'},
                    {validator: Email, trigger:'blur'}
                ],
                mobile:[
                   { required:true,message:'请输入手机号',trigger:'blur'},
                    {validator: Mobile, trigger:'blur'}
                ]
            }, 
            editformRules:{  // 编辑用户效验
                email:[
                   { required:true,message:'请输入用户邮箱',trigger:'blur'},
                    {validator: Email, trigger:'blur'}
                ],
                mobile:[
                    { required:true,message:'请输入用户手机号',trigger:'blur'},
                    {validator: Mobile, trigger:'blur'}
                ]
            },  
            roledialogVisible:false,//显示隐藏分配角色对话框的布尔值  
            userinfo:{},//需要被分配角色的用户信息     
            rolelist:{}, //所有角色的数据列表  
            selectroleid:'' // 已选的角色id值
        };
    },
    created() {

    },
    mounted() {
        //刷新用户列表
        this.userslist()
    },
    methods: {
        //获取用户列表
        async userslist(){
            let {data:res} =await this.$http.get('users',{params:this.info})
           // console.log(res)
            if(res.meta.status!==200){
                this.$message.error('获取用户列表失败！')
            }else{
                this.ulist=res.data.users
                this.total=res.data.total
            }
        },
        //监听pagesize改变的事件
        handleSizeChange(newsize){
            //console.log(newsize)
            this.info.pagesize=newsize   
            this.userslist() //刷新用户列表
        },
        //监听页码值改变的事件
        handleCurrentChange(newpage){
            //console.log(newpage)
            this.info.pagenum=newpage
            this.userslist()  //刷新用户列表
        },
        //状态改变
        async change(stateinfo){
            //console.log(stateinfo)
           let {data:res} = await this.$http.put(`users/${stateinfo.id}/state/${stateinfo.mg_state}`)
           //console.log(res)
           if(res.meta.status!==200){
               stateinfo.mg_state=!stateinfo.mg_state
               this.$message.error('更新用户状态失败！')
           }else{
                this.$message.success('更新用户状态成功！')
           }
        },
        //关闭添加框重置
        addClose(){
            this.$refs.fromRef.resetFields()
        },
        //点击添加用户确定
        adduser(){
             this.$refs.fromRef.validate(valid=>{
                 //console.log(valid)
                 if(valid){
                    //发起添加用户请求 
                    this.adduser()
                 }else{
                    console.log('error submit!!');
                    return false;
                 }
             })
        },
        //请求添加用户接口
        async adduser(){
            let {data:res} =await this.$http.post('users',this.addform)
            //console.log(res)
             if(res.meta.status==201){
                this.dialogVisible=false
                this.userslist()
                this.$message.success('添加用户成功！')
           }else{
                this.$message.error('添加用户失败！')
           }
        },
        //点击编辑按钮请求接口获取id用户信息
        async edit(id){
            
           let {data:res} = await this.$http.get('users/'+id)
           if(res.meta.status==200){
                this.editform=res.data
                this.editdialogVisible = true
           }else{
                this.$message.error('查询用户信息失败！')
           }
        },
        //重置编辑表单
        editClose(){
            this.$refs.editfromRef.resetFields()
        },
        //点击编辑用户确定按钮
        edituserinfo(){
            this.$refs.editfromRef.validate(valid=>{
                if(valid){
                    //发起修改用户的请求
                    this.edituserlist()
                }
            })
        },
        // 请求修改用户的接口
        async edituserlist(){
            let {data:res} =await this.$http.put('users/'+this.editform.id,
            { email:this.editform.email,mobile:this.editform.mobile}
            )
            if(res.meta.status==200){
                this.editdialogVisible=false
                this.$message.success('更新用户成功！')
                this.userslist()
            }else{
                 this.$message.error('更新用户信息失败！')
            }
        },
        //根据id删除对应的用户信息
        del(id){
            //console.log(id)
             this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.deluser(id)    
                this.userslist()  
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
        },
        //调用删除接口
        async deluser(id){
            let {data:res}= await this.$http.delete('users/'+id)
            this.userslist()  
          
        },
        //点击分配角色按钮
        async role(userinfo){
            this.userinfo=userinfo
            //在显示对话框之前获取所有角色列表
            let {data:res} =await this.$http.get('roles')
            if(res.meta.status==200){
                this.$message.success('获取角色列表成功')
                this.rolelist=res.data
            }else{
                this.$error('获取角色列表失败')
            }
            this.roledialogVisible=true
        },
        //点击分配角色确定按钮
        async roleinfo(){
            if(!this.selectroleid){
                return this.$message.error("请选择要分配的角色")
            }
            //发起请求
            let {data:res} =await this.$http.put(`users/${this.userinfo.id}/role`,{rid:this.selectroleid})
            if(res.meta.status==200){
                this.$message.success('更新角色成功！')
                this.userslist()
                this.roledialogVisible=false
            }else{
                this.$message.error("更新角色失败！")
            }
        },
        //监听分配角色对话框的关闭事件
        roleClose(){
            this.selectroleid='',
            this.userinfo={}
        }
        
    }
};
</script>

<style scoped>

</style>