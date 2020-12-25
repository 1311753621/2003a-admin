<template>
    <div>
          <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable v-model="queryinfo.query"  @clear="goodslist">
                        <el-button  slot="append" icon="el-icon-search" @click="goodslist"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                     <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="95px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.add_time|timefn}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="130px">
                     <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.goods_id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>   
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryinfo.pagenum"
                :page-sizes="[2, 5, 10, 15]"
                :page-size="queryinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
            </el-pagination>
        </el-card>   
        <el-dialog
            title="编辑"
            :visible.sync="editdialogVisible"
            width="50%"
           >
            <span>不可修改！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            //商品列表
            goodsList:[],
            editdialogVisible:false
        };
    },
    created() {

    },
    mounted() {
            this.goodslist()
    },
    methods: {
            async goodslist(){
                let {data:res} =await this.$http.get('goods',{params:this.queryinfo})
                if(res.meta.status!==200){
                    return this.$message.error('获取商品列表失败')
                }
               // this.$message.success('获取商品列表成功')
                this.total=res.data.total
                this.goodsList=res.data.goods
                console.log(this.goodsList)
            },
            handleSizeChange(newsize){
                this.queryinfo.pagesize=newsize
                this.goodslist()
            },
            handleCurrentChange(newpage){
                this.queryinfo.pagenum=newpage
                this.goodslist()
            },
            //删除商品
            async del(id){
                let confirmResult =await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
                //用户取消了操作
                if(confirmResult!=='confirm'){
                    return this.$message.info('已取消删除！')
                }
                //删除的接口
                let {data:res}=await this.$http.delete(`goods/${id}`)
                if(res.meta.status!==200){
                    return this.$message.error('删除商品失败！')
                }
                this.$message.success('删除商品成功！')
                this.goodslist()
            },
            //点击编辑
            edit(){
                this.editdialogVisible=true
            }
    }
};
</script>

<style scoped>

</style>