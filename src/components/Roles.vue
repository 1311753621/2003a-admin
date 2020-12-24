<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-card>
            <!-- 添加角色按钮 -->
           <el-row>
               <el-col>
                    <el-button type="primary"  @click="adddialogVisible = true">添加角色</el-button>
               </el-col>
           </el-row>
           <el-table :data="alllist" border stripe>
               <el-table-column type="expand">
                   <template slot-scope="scope">
                      <el-row :class="['bdbottom',key1 === 0 ? 'bdtop' : '' ,'vcenter']" v-for="(item1,key1) in scope.row.children" :key="item1.id">
                          <el-col :span="5">
                              <el-tag  closable @close="deltag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <el-col :span="19">
                              <el-row :class="[key2 === 0  ? '' : 'bdtop' , 'vcenter']" v-for="(item2,key2) in item1.children" :key="item2.id">
                                  <el-col :span="6">
                                    <el-tag type="success" closable @close="deltag(scope.row,item2.id)"> {{item2.authName}} </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                  </el-col>
                                  <el-col :span="18">
                                      <el-tag type="warning" v-for="(item3,key3) in item2.children" 
                                      :key="item3.id" closable @close="deltag(scope.row,item3.id)"> 
                                           {{item3.authName}} 
                                      </el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                   </template>
               </el-table-column>
               <el-table-column type="index"></el-table-column>
               <el-table-column label="角色名称" prop="roleName"></el-table-column>
               <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
               <el-table-column label="操作" width="300px">
                   <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">编辑</el-button>                                         
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)">删除</el-button>                      
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showrole(scope.row)">分配权限</el-button>
                   </template>
               </el-table-column>
           </el-table>
        </el-card>
          <!--分配权限的对话框 -->
            <el-dialog
                title="分配权限"
                :visible.sync="roledialogVisible"
                @close="rightclose"
                width="50%" 
                >
                <el-tree ref="treeRef" :default-checked-keys="defKeys" default-expand-all node-key="id" show-checkbox :data="rightslist" :props="defaultProps" ></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="roledialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allRolse">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 添加角色的对话框 -->
            <el-dialog
                title="添加角色"
                :visible.sync="adddialogVisible"
                width="50%"
                @close="addClose"
               >
              <el-form :model="userruleForm" :rules="userrules" ref="addruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="userruleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="userruleForm.roleDesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="adddialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="adduser()">确 定</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
              <!-- 编辑角色的对话框 -->
            <el-dialog
                title="编辑角色"
                :visible.sync="editdialogVisible"
                width="50%"
                 @close="editClose"
               >
              <el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editruleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editruleForm.roleDesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="editdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="edituser('editruleForm')">确 定</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            alllist:[],
            roledialogVisible:false,//分配权限的显示隐藏
            rightslist:[], //所有权限的数据  
            defaultProps: { //树形控件的绑定对象
                label:'authName',
                children:'children'
            },
            defKeys:[],  //默认选中的节点id值数组
             roleid:'',//即将分配角色的id
             adddialogVisible:false,//添加角色的对框框显示隐藏
             editdialogVisible:false,//编辑角色的对框框显示隐藏
            userruleForm:{
                 roleName:'',
                 roleDesc:'',
             },
             editruleForm:{

             },
            
            userrules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
              },
              editrules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
              }
        };
    },
    created() {

    },
    mounted() {
        this.roleslist()
    },
    methods: {
        //获取所有角色数据调用接口
        async roleslist(){
            let {data:res} =await this.$http.get('/roles')
            if(res.meta.status==200){
              this.alllist=res.data
             // console.log(this.alllist)
            }
        },
        //根据id删除对应的三级权限
            async deltag(role,rightId){
                        let confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).catch(err=>err)
                        if( confirmResult!=='confirm'){
                            return this.$message.info('取消了删除！')
                        }
                        let {data:res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                        if(res.meta.status!==200){
                        return this.$message.error('删除权限失败！')
                        }
                        role.children=res.data //把最新的权限直接赋值给当前角色的children属性
        }, 
        //分配权限按钮
        showrole(role){
            this.roleid=role.id
            console.log(this.roleid)
            //获取所有权限的数据
            this.allquan()
            //获取三级节点的id
            this.getkeys(role,this.defKeys)
            this.roledialogVisible=true
        },
       //获取所有权限的数据
       async allquan(){
           let {data:res} =await this.$http.get('rights/tree')
            if(res.meta.status==200){
               
                this.rightslist=res.data
              //  console.log(this.rightslist)
            }
       },
       //通过递归的形式获取角色下所有三级权限的id并保存
       getkeys(node,arr){
           if(!node.children){
               //如果当前node节点不包含children属性则是三级节点
               return arr.push(node.id)
           }
           node.children.forEach(item=>
            this.getkeys(item,arr))
       },
       //监听分配权限对话框的关闭事件
       rightclose(){
           this.defKeys=[]
       },
       //点击确定角色分配权限
       async allRolse(){
           let keys=[
               ...this.$refs.treeRef.getCheckedKeys(),
               ...this.$refs.treeRef.getHalfCheckedKeys()
           ]
           let idStr=keys.join(',')
           let {data:res} = await this.$http.post(`roles/${this.roleid}/rights`,{rids:idStr})
            if(res.meta.status==200){
                this.$message.success('分配权限成功！')
                this.roleslist()
                this.roledialogVisible=false
            }else{
                 this.$message.error('分配权限失败！')    
            }
      },
      //添加角色
      adduser(){
        this.$refs.addruleForm.validate((valid) => {
          if (valid) {
            this.addusers()
             this.roleslist()
            this.adddialogVisible=false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
        //调用添加角色的接口
        async addusers(){
            let {data:res} = await this.$http.post('roles',this.userruleForm)
            console.log(res)
            if(res.meta.status==201){
                this.$message.success('创建角色成功！')
            }else{
                this.$message.error('创建角色失败！')
            }
        },
         //关闭添加框重置
        addClose(){
            this.$refs.addruleForm.resetFields()
        },
        //点击编辑角色信息 获取id
        async edit(id){
            this.editdialogVisible=true
              let {data:res} = await this.$http.get('roles/'+id)
                console.log(res)
                if(res.meta.status==200){
                    this.editruleForm=res.data
                     this.editId=res.data.roleId
                }  
        },
        //重置编辑框
        editClose(){
            this.$refs.editruleForm.resetFields()
        },
        //点击确定编辑
        async edituser(){
           // console.log(this.editrules)
            this.$refs.editruleForm.validate(valid=>{
                if(valid){
                    //发起修改用户的请求
                    this.edituserlist()
                }
            })
            
        },
        //调用编辑接口
         async edituserlist(){
             let {data:res} = await this.$http.put('roles/'+this.editruleForm.roleId,
             {roleName:this.editruleForm.roleName,roleDesc:this.editruleForm.roleDesc})
                console.log(res)
                if(res.meta.status==200){
                    this.$message.success('编辑角色成功！')
                    this.editdialogVisible=false
                    this.roleslist()
                }else{
                    this.$message.error('创建角色失败！')
                }
         },
         //删除角色
         del(id){
              this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.deluser(id)
                   
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                    });
         },
         //调用删除接口
         async deluser(id){
            let {data:res} =await this.$http.delete('roles/'+id)
            console.log(res)
            this.roleslist()
         }

      
      
           
        
    }
};
</script>

<style scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
