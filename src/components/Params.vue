<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类参数</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-card>
            <!-- 警告 -->
            <el-alert title="注意！只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品的级联选择框 -->
                     <el-cascader
                        v-model="selectedkeys"
                        expand-trigger="hover"
                        :options="Paramslist"
                        :props="cateProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- tab页签 -->
             <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many" size="mini">
                    <el-button type="primary" :disabled="btndisabled" @click="dialogVisible = true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTabdata" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i">  {{item}} </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-edit" size="mini" @click="del(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only" size="mini">
                    <el-button type="primary" :disabled="btndisabled" @click="dialogVisible = true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTabdata" border stripe>
                         <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,i) in scope.row.attr_vals" :key="i">  {{item}} </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-edit" size="mini" @click="del(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框 -->
        <el-dialog
            :title="'添加'+titletext"
            :visible.sync="dialogVisible"
            @close="addClose"
            width="50%">
            <el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px" >
                <el-form-item :label="titletext" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams()">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 修改参数的对话框 -->
        <el-dialog
            :title="'修改'+titletext"
            :visible.sync="editdialogVisible"
            @close="editClose"
            width="50%">
            <el-form :model="editForm" :rules="editFormrules" ref="editFormref" label-width="100px" >
                <el-form-item :label="titletext" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
                Paramslist:[],//商品分类列表
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children',
                }, // 级联选择框的配置对象
                selectedkeys:{}, //级联选择框双向绑定的数组
                activeName:'many', //被激活的页签的名称
                //动态参数的数据
                manyTabdata:[],
                //静态属性的保存
                onlyTabdata:[],
                //添加的模态框
                dialogVisible:false,
                //修改的模态框
                editdialogVisible:false,
                addForm:{},//添加参数的表单数据对象
                editForm:{},//修改参数的表单数据对象
                //添加表单的验证对象
                addFormrules:{
                    attr_name:[
                        {required:true,message:'请输入参数名称',trigger:'blur'}
                  ]
                }, 
                //修改表单的验证对象
                editFormrules:{
                    attr_name:[
                        {required:true,message:'请输入参数名称',trigger:'blur'}
                  ]
                }, 
                // inputVisible:false, //控制按钮与文本框的切换显示
                // inputValue:'',   //文本框中输入的内容


        };
    },
    created() {
    },
    mounted() {
            this.paramslist()
    },
    methods: {
            async paramslist(){ 
                let {data:res} = await this.$http.get('categories')
                if(res.meta.status==200){
                    this.Paramslist=res.data
                   // console.log(this.Paramslist)
                }else{
                    this.$message.error('获取商品分类失败')
                }
            },
            handleChange(){//级联选择框选中项变化，会触发这个函数
                this.getparamslist()
            },
            //获取参数的列表数据
            async getparamslist(){
                    if(this.selectedkeys.length!==3){
                        this.selectedkeys=[]
                        this.manyTabdata=[]
                        this.onlyTabdata=[]
                        return
                    }
                    //证明选中的是三级分类
                    //根据所选分类的id，和当前所处的面板，获取对应的参数
                    let {data:res} =await this.$http.get(`categories/${this.cateId}
                    /attributes`,{params:{sel:this.activeName}})
                   
                   
                        if(res.meta.status==!200){
                            return this.$message.error('获取失败！')  
                        }
                    res.data.forEach(item=>{
                        item.attr_vals=item.attr_vals ? item.attr_vals.split(' ') : []
                    })
                     console.log(res.data)

                    if(this.activeName==='many'){
                        this.manyTabdata=res.data
                    }else{
                        this.onlyTabdata=res.data
                    }
            },
            handleTabClick(){//tab页签点击事件的处理函数
                // console.log(this.activeName)
                this.getparamslist()
            },
            //监听对话框的关闭事件
            addClose(){
                this.$refs.addFormref.resetFields()
            },
            //点击按钮添加参数
            addParams(){
                this.$refs.addFormref.validate(async valid=>{
                    if(!valid) return
                    let {data:res}= await this.$http.post(`categories/${this.cateId}
                    /attributes`,{
                        attr_name:this.addForm.attr_name,
                        attr_sel:this.activeName
                    }) 
                    if(res.meta.status==201){
                        this.$message.success('添加参数成功')
                        this.dialogVisible=false
                        //刷新列表
                        this.getparamslist()
                    }else{
                        this.$message.error('添加参数失败！')
                    }
                })
            },
            //重置修改的表单
            editClose(){
                this.$refs.editFormref.resetFields()
            },
            //点击按钮获取参数信息
            async edit(attr_id){
                let {data:res} =await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                    params:{attr_sel:this.activeName}
                })
                if(res.meta.status!==200){
                    return this.$message.error('获取失败')
                }
                this.editForm=res.data
                this.editdialogVisible=true
            },
            //点击确定修改参数
            editParams(){
                  this.$refs.editFormref.validate(async valid=>{
                        if(!valid) return
                        let {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {attr_name:this.editForm.attr_name,attr_sel:this.activeName})
                        if(res.meta.status!==200){
                            return this.$message.error('修改参数失败！')
                        }
                        this.$message.success('修改参数成功！')
                        this.getparamslist()        //刷新列表
                        this.editdialogVisible=false  //模态框隐藏
                        })                 
            },
            //根据id删除参数
            async del(attr_id){
                let confirmResult =await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
                //用户取消了操作
                if(confirmResult!=='confirm'){
                    return this.$message.info('已取消删除！')
                }
                //删除的业务
                let {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if(res.meta.status!==200){
                    return this.$message.error('删除参数失败！')
                }
                this.$message.success('删除参数成功！')
                this.getparamslist()
            },
            //文本框失去焦点或者按下enter
            handleInputConfirm(row){
                // if (row.inputValue.trim().length === 0) {
                //     row.inputValue = ''
                //     row.inputVisible = false
                //     return
                // }
            },
            //点击按钮显示文本输入框
            showInput(row){
                row.inputVisible = true
                //让文本框自动获得焦点
                //$nextTick的作用：就是当页面上的元素被重新渲染之后，才会执行回调函数中的代码
               this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            }
           
    },
    computed:{
        //如果按钮需要被禁用，则返回true，否则返回false
        btndisabled(){
            if(this.selectedkeys.length!==3){
                return true
            }
            return false
        },
        //当前选中的三级分类id
        cateId(){
            if(this.selectedkeys.length===3){
                return this.selectedkeys[2]
            }
            return null
        },
        //动态计算标题的文本
        titletext(){
            if(this.activeName==='many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    }
};
</script>

<style scoped lang="scss">
.cat_opt{
    margin: 15px 0px;
   
}
span{
        font-size: 16px;
    }
.el-tag{
    margin: 10px;
}
.input-new-tag{
    width: 120px;
}
</style>