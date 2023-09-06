<template>
    <div>
        <div style="margin-bottom: 20px;">
            <el-input style="width: 240px" placeholder="请输入图书名称" v-model="pagination.name"></el-input>
            <el-input style="width: 240px; margin-left: 5px" placeholder="请输入图书标准码" v-model="pagination.bookNo"></el-input>
            <el-input style="width: 240px; margin-left: 5px" placeholder="请输入作者" v-model="pagination.author"></el-input>
            <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i> 搜索</el-button>
            <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i> 重置</el-button>
        </div>
        <el-table :data="tableData" stripe>
            <el-table-column prop="id" label="编号" width="80"></el-table-column>
            <el-table-column prop="name" label="图书名称"></el-table-column>
            <el-table-column prop="bookNo" label="标准码"></el-table-column>
            <el-table-column prop="description" width="200" label="描述"></el-table-column>
            <el-table-column prop="publishDate" label="出版日期"></el-table-column>
            <el-table-column prop="author" label="作者"></el-table-column>
            <el-table-column prop="publisher" label="出版社"></el-table-column>
            <el-table-column prop="category" label="分类"></el-table-column>
            <el-table-column prop="score" label="借书积分"></el-table-column>
            <el-table-column prop="nums" label="数量"></el-table-column>
            <el-table-column prop="cover" label="封面">
                <template v-slot="scope">
                    <el-image :src="scope.row.cover" :preview-src-list="[scope.row.cover]"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>

            <el-table-column label="操作" width="250">
                <template v-slot="scope">
                    <!-- scope.row就是当前行数据 -->
                    <!-- 将当前行的id带到编辑界面，实际上是带到了编辑页面的路由中 -->
                    <el-button type="primary" @click="$router.push('/editBook?id=' + scope.row.id)">编辑</el-button>
                    <el-popconfirm title="您确定删除这个用户吗？" @confirm="del(scope.row.id)" style="margin-left: 5px;">
                        <el-button type="danger" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <div class="pagination-container">

            <el-pagination class="pagiantion" @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                :page-size="pagination.pageSize" layout="total, prev, pager, next, jumper" :total="pagination.total">
            </el-pagination>

        </div>
    </div>
</template>
 
<script>
import request from '@/utils/request'
import { del } from 'vue'

export default {
    name: 'Book',
    data() {
        return {
            tableData: [],
            pagination: {//分页相关模型数据
                currentPage: 1,//当前页码
                pageSize: 10,//每页显示的记录数
                total: 0,//总记录数
                name: '',
                bookNo: '',
                author: ""
            },
        }
    },
    created() {
        this.load()
    },
    methods: {
        // 改变分页组件
        handleCurrentChange(currentPage) {
            this.pagination.currentPage = currentPage;
            this.load();
        },
        // 获取所有数据,分页查询
        load() {
            request.get('/book/list', { params: this.pagination }).then(res => {
                if (res.code === '200') {
                    // console.log(res.data);
                    this.pagination.pageSize = res.data.size;
                    this.pagination.currentPage = res.data.current;
                    this.pagination.total = res.data.total;
                    this.tableData = res.data.records;
                } else {
                    this.$notify.error(res.msg)
                }

            })
        },
        reset() {
            this.pagination = {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                name: '',
                bookNo: ""
            }
            this.load()
        },
        del(id) {
            request.delete("/book/" + id).then(res => {
                if (res.code === '200') {
                    this.$notify.success("删除成功")
                    this.load()
                } else {
                    this.$notify.error(res.msg)
                }
            })
        }

    }
}
</script>
 
<style lang="scss" scoped></style>