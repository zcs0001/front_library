<template>
    <div style="width: 80%">
        <div style="margin-bottom: 30px">编辑图书</div>
        <el-form :inline="true" :rules="rules" ref="ruleForm" :model="formData" label-width="100px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input style="width: 400px" type="textarea" v-model="formData.description"
                    placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item label="出版日期" prop="publishDate">
                <el-date-picker v-model="formData.publishDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择出版日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model="formData.author" placeholder="请输入作者"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
                <el-input v-model="formData.publisher" placeholder="请输入出版社"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category">
                <el-cascader style="width: 220px" :props="{ value: 'name', label: 'name' }" v-model="formData.categories"
                    :options="categories"></el-cascader>
            </el-form-item>
            <el-form-item label="标准码" prop="bookNo">
                <el-input v-model="formData.bookNo" placeholder="请输入标准码"></el-input>
            </el-form-item>
            <el-form-item label="借书积分" prop="score">
                <el-input-number v-model="formData.score" :min="10" :max="1000" label="所需积分"></el-input-number>
            </el-form-item>
            <br>
            <el-form-item label="封面" prop="cover">
                <el-upload class="avatar-uploader"
                    :action="'http://localhost:9090/api/book/file/upload?token=' + this.admin.token" :show-file-list="false"
                    :on-success="handleCoverSuccess">
                    <img v-if="formData.cover" :src="formData.cover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
        </el-form>

        <div style="text-align: center;margin-top: 30px;">
            <el-button type="primary" @click="saveBook">提交</el-button>
        </div>


    </div>
</template>
 
<script>
import request from '@/utils/request';
import Cookies from 'js-cookie'
export default {
    name: "EditBook",
    data() {
        return {
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
            formData: { score: 10 },
            categories: [],
            rules: {
                name: [
                    { required: true, message: '请输入图书名称', trigger: 'blur' }
                ],
                bookNo: [
                    { required: true, message: '请输入图书标准码', trigger: 'blur' }
                ],
                score: [
                    { required: true, message: '请输入借书积分', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        request.get('/category/tree').then(res => {
            this.categories = res.data
        })

        // 获取编辑按钮传到路由中的id
        const id = this.$route.query.id
        request.get("/book/" + id).then(res => {
            console.log(res.data);
            this.formData = res.data
            // 拿到的数据是 '历史文化>唐朝文化' 这种形式，是不能显示的，要将其变成['历史文化','唐朝文化']形式，才能显示。
            if (this.formData.category) {
                // 前后端有没有空格要一致
                this.formData.categories = this.formData.category.split('>')
                // console.log(this.formData.categories)
            }
        })
    },
    methods: {
        saveBook() {
            request.put('/book', this.formData).then(res => {
                if (res.code === '200') {
                    this.$notify.success("修改成功")
                    this.$router.push('/book')
                    // this.formData = {}
                } else {
                    this.$notify.error(res.msg)
                }
            })
        },
        handleCoverSuccess(res) {
            if (res.code === '200') {
                console.log(res.data)
                // this.$set(this.form, 'cover', res.data)
                this.formData.cover = res.data
            }
        },
    }
}
</script>
 
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>