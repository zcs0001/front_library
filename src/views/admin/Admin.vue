<template>
    <div>
        <div style="margin-bottom: 20px;">
            <el-input style="width: 240px" placeholder="请输入名称" v-model="pagination.name"></el-input>
            <el-input style="width: 240px;margin-left: 5px" placeholder="请输入联系方式" v-model="pagination.phone"></el-input>
            <el-input style="width: 240px;margin-left: 5px" placeholder="请输入邮箱" v-model="pagination.email"></el-input>
            <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i> 搜索</el-button>
            <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i> 重置</el-button>
        </div>
        <el-table :data="tableData" stripe>
            <el-table-column prop="id" label="编号" width="100"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="phone" label="手机号码"></el-table-column>
            <el-table-column prop="email" label="邮箱地址"></el-table-column>
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
                    <!-- scope.row就是当前行数据 -->
                    <!-- 将当前行的id带到编辑界面，实际上是带到了编辑页面的路由中 -->
                    <el-button type="primary" @click="$router.push('/editAdmin?id=' + scope.row.id)">编辑</el-button>
                    <el-popconfirm title="您确定删除这个用户吗？" @confirm="del(scope.row.id)" style="margin-left: 5px;">
                        <el-button type="danger" slot="reference">删除</el-button>
                    </el-popconfirm>
                    <el-button type="warning" @click="handleChangePassword(scope.row)"
                        style="margin-left: 5px;">修改密码</el-button>
                </template>
            </el-table-column>

        </el-table>
        <!--分页组件-->
        <div class="pagination-container">
            <el-pagination class="pagiantion" @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                :page-size="pagination.pageSize" layout="total, prev, pager, next, jumper" :total="pagination.total">
            </el-pagination>

        </div>
        <!-- 修改密码弹窗 -->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="passwordForm" label-width="100px" :rules="rules" ref="ruleForm">
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="passwordForm.newPwd" autocomplete="off" show-password="false"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePassword">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
 
<script>
import request from '@/utils/request'
import Cookies from 'js-cookie'

export default {
    name: 'Admin',
    data() {
        return {
            admin: Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : {},
            tableData: [],
            dialogFormVisible: false,
            passwordForm: {},
            pagination: {//分页相关模型数据
                currentPage: 1,//当前页码
                pageSize: 10,//每页显示的记录数
                total: 0,//总记录数
                id: '',//条件查询的参数
                name: '',
                phone: '',
                email: ''
            },
            rules: {
                newPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur' }
                ],
            }
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
            request.get('/admin/list', { params: this.pagination }).then(res => {
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
                phone: '',
                email: ''
            }
            this.load()
        },
        del(id) {
            request.delete("/admin/" + id).then(res => {
                if (res.code === '200') {
                    this.$notify.success("删除成功")
                    this.load()
                } else {
                    this.$notify.error(res.msg)
                }
            })
        },
        handleChangePassword(row) {
            this.passwordForm = JSON.parse(JSON.stringify(row))
            this.dialogFormVisible = true
        },
        savePassword() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    request.put("/admin/password", this.passwordForm).then(res => {
                        if (res.code === '200') {
                            this.$notify.success("修改成功")
                            // 从cookie中获取当前对象
                            if (this.passwordForm.id === this.admin.id) {//当前修改的用户的id等于当前登录的管理员id，那么修改成功之后需要重新登录
                                Cookies.remove("admin")
                                this.$router.push("/login")
                            } else {
                                this.dialogFormVisible = false
                                this.load()
                            }
                        } else {
                            this.$notify.error("修改失败")
                        }
                    })
                }
            })
        },
        changeStatus(row) {
            if (this.admin.id === row.id && !row.status) {
                row.status = true
                this.$notify.warning("您的操作不合法")
                return
            }
            request.put('/admin', row).then(res => {
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