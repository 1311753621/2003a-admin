<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item> 
        </el-breadcrumb>
         <el-card>
             <el-table :data="rightslist">
                 <el-table-column type="index"></el-table-column>
                 <el-table-column label="权限名称" prop="authName"></el-table-column>
                 <el-table-column label="路径" prop="path"></el-table-column>
                 <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='0'">1级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level==='1'">2级</el-tag>
                        <el-tag type="warning" v-else>3级</el-tag>
                    </template>
                 </el-table-column>
               
             </el-table>
         </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightslist:[]  
        };
    },
    created() {

    },
    mounted() {
            this.getRightslist()
    },
    methods: {
            async getRightslist(){
                let {data:res} =await this.$http.get('rights/list')
                if(res.meta.status==200){
                   //  this.$message.success('获取权限列表成功！')
                     this.rightslist=res.data
                    // console.log(this.rightslist)
                }else{
                    this.$message.error('获取权限列表失败！')
                }
            }
    }
};
</script>

<style scoped>

</style>