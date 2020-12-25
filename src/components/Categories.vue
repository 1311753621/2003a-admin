<template>
    <div>
          <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品分类</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                     <el-button type="primary" @click="addcate">添加分类</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <!-- s树形控件 -->
                    <tree-table 
                        class="treetable"
                        :data="catelist"
                        :columns="columns"
                        :selection-type="false"
                        :expand-type="false"
                        show-index index-text="#" border
                        > 
                        <template slot="one" slot-scope="scope">
                            <i class="el-icon-success" style="color:green" v-if="scope.row.cat_deleted===false"></i>
                            <i class="el-icon-success" style="color:red" v-else></i>
                        </template>
                         <template slot="two" slot-scope="scope">
                           <el-tag v-if="scope.row.cat_level===0" >一级</el-tag>
                           <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
                           <el-tag v-else type="warning">三级</el-tag>
                        </template>
                          <template slot="three" slot-scope="scope">
                            <el-button type="primary" size="mini">编辑</el-button>
                            <el-button type="danger" size="mini">删除</el-button>
                        </template>
                    </tree-table>
                    <!-- 分页器 -->
                     <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="query.pagenum"
                        :page-sizes="[2, 5, 8, 10]"
                        :page-size="query.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
          <!-- 添加分类的对话框 -->
                    <el-dialog
                        title="添加分类"
                        :visible.sync="adddialogVisible"
                        width="50%"
                        >
                        <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="分类名称" prop="cat_name">
                                <el-input v-model="addRuleForm.cat_name"></el-input>
                            </el-form-item>
                            <el-form-item label="父级分类" >
                                <el-cascader
                                    v-model="value"
                                    :options="parentlist"
                                    :props='cateprops'
                                    clearable
                                    @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </el-form>    
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="adddialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addCatelei">确 定</el-button>
                        </span>
                        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            query:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
            catelist:[], //分类数据
            columns:[
                {label:'分类名称',prop:"cat_name"},
                {label:'是否有效',type:'template',template:"one"},
                {label:'排序',type:'template',template:"two"},
                {label:'操作',type:'template',template:"three"},
            ],
            adddialogVisible:false,
            parentlist:[],  //父级分类的数据
            cateprops:{
                value:'cat_id', //父级分类的id
                label:'cat_name', 
                children:'children'  //父级的子级
            },
            value:'', //选中的父级分类id数组
            addRuleForm:{
                cat_name:'', //父级分类的名称
                cat_pid:0,  //父级分类的id
                cat_level:0,  //分类的等级 ===0
            },
            addRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ],
            },
            }
    },
    created() {

    },
    mounted() {
        this.getcatelist()
    },
    methods: {
            async getcatelist(){
                let {data:res} = await this.$http.get('categories',{params:this.query})
               
                if(res.meta.status==200){
                    this.catelist=res.data.result
                   
                    this.total=res.data.total
                }else{
                    this.$message.error('获取数据失败！')
                }
            },
            handleSizeChange(size){
                this.query.pagesize=size
                this.getcatelist()
            },
            handleCurrentChange(num){
                this.query.pagenum=num
                this.getcatelist()
            },
            //点击添加分类按钮
            addcate(){
                this.getparentlist()
                this.adddialogVisible=true
            },
            //请求父级分类的数据列表
            async getparentlist(){
                let {data:res} = await this.$http.get('categories',{params:{type:2}})
               
                if(res.meta.status==200){
                        this.parentlist=res.data
                }
            },
            //点击确定按钮添加分类
            addCatelei(){
                 this.$refs.addRuleForm.validate(async valid => {
                        if (valid) {
                           let {data:res} = await this.$http.post("categories",this.addRuleForm)
                            if(res.meta.status==201){
                                this.$message.success('创建分类成功！')
                                this.adddialogVisible=false
                                 this.getcatelist()

                            }else{
                                this.$message.error('创建分类失败！')
                            }
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                        });
      },
            
            //x选择项发生改变的时候触发这个方法
            handleChange(){
                console.log(this.value)
                //大于0的时候表示选中的父级分类
                if(this.value.length>0){
                        this.addRuleForm.cat_pid=this.value[this.value.length-1]
                        this.addRuleForm.cat_level=this.value.length
                        return
                }else{
                    this.addRuleForm.cat_pid=0
                    this.addRuleForm.cat_level=0
                }                                                 
            }
    }
};
</script>

<style scoped>

</style>
