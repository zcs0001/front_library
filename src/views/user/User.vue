<template>
    <div>
        <div style="margin-bottom: 20px;">
            <el-input style="width: 240px" placeholder="请输入id" v-model="pagination.id"></el-input>
            <el-input style="width: 240px" placeholder="请输入名称" v-model="pagination.name"></el-input>
            <el-input style="width: 240px; margin-left: 5px" placeholder="请输入联系方式" v-model="pagination.phone"></el-input>
            <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i> 搜索</el-button>
            <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i> 重置</el-button>
        </div>
        <el-table :data="tableData" stripe>
            <el-table-column prop="id" label="编号" width="100"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="username" label="用户UID"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="phone" label="联系方式"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="account" label="账户积分"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
            <el-table-column label="状态" width="100">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" @change="changeStatus(scope.row)" active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template v-slot="scope">
                    <el-button type="warning" @click="handleAccount(scope.row)">积分充值</el-button>
                    <!-- scope.row就是当前行数据 -->
                    <!-- 将当前行的id带到编辑界面，实际上是带到了编辑页面的路由中 -->
                    <el-button type="primary" @click="$router.push('/editUser?id=' + scope.row.id)">编辑</el-button>
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

        <el-dialog title="积分充值" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="form" label-width="100px" style="width: 85%;">
                <el-form-item label="当前积分" prop="account">
                    <el-input v-model="form.account" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="积分" prop="name">
                    <el-input v-model="form.score" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAccount">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
 
<script>
import request from '@/utils/request'
import { del } from 'vue'

export default {
    name: 'User',
    data() {
        return {
            tableData: [],
            pagination: {//分页相关模型数据
                currentPage: 1,//当前页码
                pageSize: 10,//每页显示的记录数
                total: 0,//总记录数
                id: '',//条件查询的参数
                name: '',
                phone: ''
            },
            dialogFormVisible: false,
            form: {}
        }
    },
    created() {
        this.load()
    },
    methods: {
        handleAccount(row) {
            this.form = JSON.parse(JSON.stringify(row))
            this.dialogFormVisible = true
        },
        addAccount() {
            request.post('/user/account', this.form).then(res => {
                if (res.code === '200') {
                    this.$notify.success("充值成功")
                    this.dialogFormVisible = false
                    this.load()
                } else {
                    this.$notify.error(res.msg)
                }
            })
        },
        // 改变分页组件
        handleCurrentChange(currentPage) {
            this.pagination.currentPage = currentPage;
            this.load();
        },
        // 获取所有数据,分页查询
        load() {
            // 第一种写法
            // let params = '';
            // params = "?id=" + this.pagination.id;
            // params += "&name=" + this.pagination.name;
            // params += "&phone=" + this.pagination.phone;
            // request.get('/user/list/' + this.pagination.currentPage + "/" + this.pagination.pageSize + params).then(res => {
            //   // console.log(res.data);
            //   this.pagination.pageSize = res.data.size;
            //   this.pagination.currentPage = res.data.current;
            //   this.pagination.total = res.data.total;
            //   this.tableData = res.data.records;
            // })
            // 第二种写法
            request.get('/user/list', { params: this.pagination }).then(res => {
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
                id: '',
                name: '',
                phone: ''
            }
            this.load()
        },
        del(id) {
            request.delete("/user/" + id).then(res => {
                if (res.code === '200') {
                    this.$notify.success("删除成功")
                    this.load()
                } else {
                    this.$notify.error(res.msg)
                }
            })
        },
        changeStatus(row) {
            request.put('/user', row).then(res => {
                if (res.code === '200') {
                    this.$notify.success("操作成功")
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