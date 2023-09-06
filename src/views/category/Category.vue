<template>
    <div>
        <div style="margin-bottom: 20px;">
            <el-input style="width: 240px" placeholder="请输入分类名称" v-model="pagination.name"></el-input>
            <el-button style="margin-left: 5px" type="primary" @click="load"><i class="el-icon-search"></i> 搜索</el-button>
            <el-button style="margin-left: 5px" type="warning" @click="reset"><i class="el-icon-refresh"></i> 重置</el-button>
        </div>
        <!-- 使用树形表格 -->
        <el-table :data="tableData" stripe row-key="id" default-expand-all :tree-props="{ children: 'children' }">
            <el-table-column prop="id" label="编号" width="100"></el-table-column>
            <el-table-column prop="name" label="分类名称"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>

            <el-table-column label="操作" width="400">
                <template v-slot="scope">
                    <!-- scope.row就是当前行数据 -->
                    <!-- 将当前行的id带到编辑界面，实际上是带到了编辑页面的路由中 -->
                    <!-- 无pid时，显示添加二级分类，既有pid也有children时，显示添加三级分类 -->
                    <el-button type="success" v-if="!scope.row.pid || scope.row.children" @click="handleAdd(scope.row)">
                        {{ !scope.row.pid ? '添加二级分类' : '添加三级分类' }}
                    </el-button>

                    <el-button type="primary" @click="$router.push('/editCategory?id=' + scope.row.id)">编辑</el-button>
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
        <!-- 二级分类弹窗 -->
        <el-dialog title="添加二级分类" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="formData" label-width="100px" :rules="rules" ref="ruleForm" style="width: 85%;">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
 
<script>
import request from '@/utils/request'

export default {
    name: 'Category',
    data() {
        return {
            tableData: [],
            // 添加二级分类表单
            formData: {},
            pid: "",
            dialogFormVisible: false,
            pagination: {//分页相关模型数据
                currentPage: 1,//当前页码
                pageSize: 10,//每页显示的记录数
                total: 0,//总记录数
                id: '',//条件查询的参数
                name: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
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
            request.get('/category/list', {
                params: this.pagination
            }).then(res => {
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
            }
            this.load()
        },
        del(id) {
            request.delete("/category/" + id).then(res => {
                if (res.code === '200') {
                    this.$notify.success("删除成功")
                    this.load()
                } else {
                    this.$notify.error(res.msg)
                }
            })
        },
        handleAdd(row) {
            // 点击添加二级或者三级分类，将父类别的id赋值给要添加对象的pid
            this.pid = row.id
            this.dialogFormVisible = true
        },
        // 点击确定触发
        save() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    // 将当前的pid赋值给formData中的pid，传给后端保存
                    this.formData.pid = this.pid
                    request.post('/category', this.formData).then(res => {
                        if (res.code === '200') {
                            this.$notify.success("新增成功")
                            this.dialogFormVisible = false
                            this.load()
                        } else {
                            this.$notify.error(res.msg)
                        }
                    })
                }
            })

        }

    }
}
</script>
 
<style lang="scss" scoped></style>