<template>
    <div>
          <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>添加商品</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon>
            </el-alert>
            <!-- 步骤条 -->
            <el-steps align-center :space="200" :active="activeIndex -0" finish-status="success">
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab -->
            <el-form label-position="top" :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px">
            <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeleave" @tab-click="tabclicked">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_wight">
                        <el-input v-model="addForm.goods_wight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                          <el-cascader 
                          expand-trigger="hover" 
                          :options="catelist" 
                          :props="cateProps" 
                          v-model="addForm.goods_cat" 
                          @change="handleChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manydata" :key="item.attr_id">                      
                            <!-- 复选框 -->
                             <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>               
                            </el-checkbox-group>
                        </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlydata" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <!-- action:图片要上传到的图片后台api地址 -->
                    <el-upload
                        action="https://www.liulongbin.top:8888/api/private/v1/upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture" 
                        :headers="headerObj"
                        :on-success="handlesuccess">
                            <el-button size="small" type="primary">点击上传</el-button>           
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 富文本编辑器 -->
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <el-button size="small" type="primary" class="btn" @click="add()">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览"  :visible.sync="dialogVisible"  width="50%"  >
          <img :src="img" alt="" class="imgpath">
        </el-dialog>                                  
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data() {
        return {
                activeIndex:'0',
                addForm:{
                    goods_name:'',
                    goods_price:0,
                    goods_wight:0,
                    goods_number:0,
                    //商品所属的分类数组
                    goods_cat:[],
                    //图片的数组
                    pics:[],
                    //商品的介绍，详情描述
                    goods_introduce:'',
                    //参数、属性
                    attrs:[],
                },
                addFormrules:{
                    goods_name:[
                        {required:true,message:'请输入商品名称',trigger:'blur'}
                    ],
                    goods_price:[
                        {required:true,message:'请输入商品价格',trigger:'blur'}
                    ],
                    goods_wight:[
                         {required:true,message:'请输入商品重量',trigger:'blur'}
                    ],
                    goods_number:[
                        {required:true,message:'请输入商品重量',trigger:'blur'}
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' }
                    ]
                    
                },
                //商品分类列表
                catelist: [],
                cateProps: {//级联选择器配置
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                //动态参数列表数据
                manydata:[],
                //静态属性列表数据
                onlydata:[],
                  //图片上传组件的header请求头
                headerObj:{
                    Authorization:window.sessionStorage.getItem('sg_token')
                },
                img:'' ,
                dialogVisible:false,
        };
    },
    created() {
    },
    mounted() {
        this.goodslist()
    },
    methods: {
        async goodslist(){
            let {data:res} = await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获取失败！')
            }
            this.catelist = res.data
           // console.log(this.catelist)
        },
        //级联选择选中项变化会触发的函数
        handleChange(){
          //  console.log(this.addForm.goods_cat)
              if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                }
        },
        //tab切换 选择分类可以切换不选择不可以切换
        beforeleave(activename,oldactivename){
            if(oldactivename==='0'&&this.addForm.goods_cat.length!==3){
                this.$message.error('请选择商品分类！')
                return false
            }

        },
        async tabclicked(){
            //证明访问的是动态参数面板
            if(this.activeIndex==='1'){
               let {data:res} =await this.$http.get
               (`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
                if(res.meta.status!==200){
                    return this.$message.error('获取失败')
                }
                //console.log(res.data)
                res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                this.manydata=res.data
            } else if(this.activeIndex==='2'){
                let {data:res} =await this.$http.get
               (`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
                if(res.meta.status!==200){
                    return this.$message.error('获取失败')
                }
               // console.log(res.data)
                this.onlydata=res.data
           }

        },
        //处理图片预览事件
        handlePreview(file){
            console.log(file)
             this.img=file.response.data.url
             this.dialogVisible=true
        },
        //处理移除图片的操作
        handleRemove(file){
            console.log(file)
            //获取将要删除的图片的临时路径，
             let filepath=file.response.data.tmp_path
            //从pics数组中找到这个图片对应的索引值
            let i =this.addForm.pics.findIndex(a=>a.pic===filepath)
            //调用数组的splice方法。把图片信息对象从pics数组中删除
            this.addForm.pics.splice(i,1)
            console.log(this.addForm)
        },
        //监听图片上传成功的事件
        handlesuccess(response){
            console.log(response)
            //拼接图片信息对象，将对象push到数组中
            let picsinfo={ pic:response.data.tmp_path }
            this.addForm.pics.push(picsinfo)  
            console.log(this.addForm)     
        },
        //添加商品
        add(){
            this.$refs.addFormref.validate(async valid=>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项目！')
                }
                //执行添加 
                let form =_.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(',')  
               //处理动态参数
               this.manydata.forEach(item=>{
                   let newdata={attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
                   this.addForm.attrs.push(newdata)
               })
               //处理静态属性
               this.onlydata.forEach(item=>{
                   let newdata={attr_id:item.attr_id,attr_value:item.attr_vals}
                   this.addForm.attrs.push(newdata)
               })
               form.attrs=this.addForm.attrs
                console.log(form)
                //添加商品接口  名称是唯一的
                 const {data:res} = await this.$http.post('goods',form)
                console.log(res)
                if(res.meta.status!==201){
                    return this.$message.error('获取失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        } 
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
};
</script>
<style scoped>
.el-checkbox{
    margin: 0 5px 0 0 !important;
}
.imgpath{
    width: 100%;
}
.btn{
    margin-top: 5px;
}
</style>