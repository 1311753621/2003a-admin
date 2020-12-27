<template>
    <div>
         <!-- 面包屑 -->
        <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>数据统计</el-breadcrumb-item>
                <el-breadcrumb-item>数据报表</el-breadcrumb-item> 
        </el-breadcrumb>
        <el-card>
            <div id="charts" style="width:'100%',height:'700px'">
                 <div id="main" :style="{width:'800px',height:'400px'}"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data() {
        return {
            
        };
    },
    created() {

    },
    mounted() {
            // 初始化echarts实例
            var reportechats = this.$echarts.init(document.getElementById("main")); // echartsExample是显示echart的元素id
            // 绘制图表
           reportechats.setOption({
            title: {
                text: "用户来源"
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                type: "cross",
                label: {
                    backgroundColor: "#6a7985"
                }
                }
            },
            legend: {
                data: ["华东", "华南", "华北", "西部", "其他"]
            },
            toolbox: {
                feature: {
                saveAsImage: {}
                }
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            xAxis: [
                {
                type: "category",
                boundaryGap: false,
                data: [
                    "2017-12-27",
                    "2017-12-28",
                    "2017-12-29",
                    "2017-12-30",
                    "2017-12-31",
                    "2018-1-1"
                ]
                }
            ],
            yAxis: [
                {
                type: "value"
                }
            ],
            series: [
                {
                name: "华东",
                type: "line",
                stack: "总量",
                areaStyle: {},
                data: [2999, 3111, 4100, 3565, 3528, 6000]
                },
                {
                name: "华南",
                type: "line",
                stack: "总量",
                areaStyle: {},
                data: [5090, 2500, 3400, 6000, 6400, 7800]
                },
                {
                name: "华北",
                stack: "总量",
                type: "line",
                areaStyle: {},
                data: [6888, 4000, 8010, 12321, 13928, 12984]
                },
                {
                name: "西部",
                stack: "总量",
                type: "line",
                areaStyle: {},
                data: [9991, 4130, 7777, 12903, 13098, 14028]
                },
                {
                name: "其他",
                stack: "总量",
                type: "line",
                label: {
                    normal: {
                    show: true,
                    position: "top"
                    }
                },
                areaStyle: {},
                data: [15212, 5800, 10241, 14821, 15982, 14091]
                }
            ]
            });
    },
    methods: {

    }
};
</script>

<style scoped>
.el-card{
    padding: 0 0 10px 0;
   
}
</style>
