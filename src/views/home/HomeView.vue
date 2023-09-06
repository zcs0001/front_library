<template>
    <div>
        <div style="margin: 20px 0">
            <el-select class="input" v-model="timeRange" placeholder="请选择" @change="load"> <!--  从后台加载最新的数据 -->
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <!-- 定义echarts图表对应的dom元素 -->
        <el-card>
            <div id="line" style="width: 100%;height: 400px"></div>
        </el-card>
    </div>
</template>
 
<script>
import request from "@/utils/request";
import Cookies from "js-cookie"
import * as echarts from 'echarts'
const option = {
    title: {
        // 标题
        text: '图书借还统计'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['借书数量', '还书数量']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        // series中的name与legend中的内容必须对应
        {
            name: '借书数量',
            type: 'line',
            // stack属性是用来堆叠的，是两者的值加起来作为纵坐标，要想二者独立显示，不受彼此影响，则将其去掉
            // stack: 'Total',
            smooth: true,
            data: []
        },
        {
            name: '还书数量',
            type: 'line',
            // stack: 'Total',
            smooth: true,
            data: []
        }
    ]
};
export default {
    name: "HomeView",
    data() {
        return {
            // 如果Cookie中存在admin，就用JSON.parse解析出来，否则就给一个空对象，admin就是再login时存在Cookie中的名字
            // 想要使用就要使用Cookie获取
            admin: Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : {},
            // echarts容器
            lineBox: null,
            timeRange: 'week',
            options: [
                { label: '最近一周', value: 'week' },
                { label: '最近一个月', value: 'month' },
                { label: '最近两个月', value: 'month2' },
                { label: '最近三个月', value: 'month3' },
            ]
        }
    },
    // 等页面元素全部初始化好之后再开始加载mounted中的内容
    mounted() {
        this.load()
    },
    // 页面初始化就开始加载
    created() {
        // request.get("/admin/" + this.admin.id).then(res => {
        //     console.log(res);
        // })
    },
    methods: {
        load() {
            if (!this.lineBox) {
                this.lineBox = echarts.init(document.getElementById('line'))  // 初始化echarts容器
            }
            // 从后台获取数据
            request.get('/borrow/lineCharts/' + this.timeRange).then(res => {
                console.log(res);
                option.xAxis.data = res.data.date
                option.series[0].data = res.data.borrow
                option.series[1].data = res.data.retur
                this.lineBox.setOption(option)  // 设置容器的属性值，当你的数据发生变化的时候，一定要重新setOption
            })
        }
    }
}
</script>
 
<style></style>