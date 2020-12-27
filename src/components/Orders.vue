<template>
    <div>
           <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-card>
             <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 订单表格 -->
            <el-table :data="orderslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                      <el-tag type="danger" v-else>未付款</el-tag>

                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send">
                     <template slot-scope="scope">
                        {{scope.row.is_send}}
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time|timefn}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="show"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="qeruyinfo.pagenum"
                :page-sizes="[5,10,15,20]"
                :page-size="qeruyinfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog @close="editClose" title="修改地址" :visible.sync="editdialogVisible" width="50%" >
      <el-form :model="orderForm" :rules="orderFormrules" ref="orderFormref" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="orderForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="orderForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog
    title="物流进度"
    :visible.sync="wuliudialogVisible"
    width="50%"
    >
        <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in showdata"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
    </el-dialog>
    </div>
</template>
<script>
import citydata from '../assets/citydata'
export default {
    data() {
        return {
                qeruyinfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10,
                },
                total:0,
                orderslist:[],
                editdialogVisible:false,
                orderForm:{
                    address1:[],
                    address2:''
                },
                orderFormrules:{
                     address1:[
                         {required:true,message:'请选择省市区县',trigger:'blur'},
                     ],
                     address2:[
                         {required:true,message:'请输入详细地址',trigger:'blur'},
                     ]
                },
                citydata,
                wuliudialogVisible:false,
                showdata:[],
               

        };
    },
    created() {

    },
    mounted() {
        this.orderlist()
    },
    methods: {
        async orderlist(){
            let {data:res} =await this.$http.get('orders',{params:this.qeruyinfo})
            if(res.meta.status!==200){
                return this.$message.error('获取失败！')
            }
            this.orderslist=res.data.goods
            this.total=res.data.total
            console.log(res)
        },
        handleSizeChange(newsize){
            this.qeruyinfo.pagesize=newsize
             this.orderlist()
        },
        handleCurrentChange(newpage){
              this.qeruyinfo.pagenum=newpage
                this.orderlist()
        },
        edit(){
            this.editdialogVisible=true
        },
        //清空对话框
        editClose(){
            this.$refs.orderFormref.resetFields()
        },
        //点击物流
        async show(){
                let {data:res} = await this.$http.get('/kuaidi/804909574412544580')
                if(res.meta.status!==200){
                    return this.$message.error('获取失败！')
                }
                this.wuliudialogVisible=true
                this.showdata=res.data      
        }
    }
};
</script>
<style scoped lang="scss">
.el-cascader{
    width: 100%;
}
</style>