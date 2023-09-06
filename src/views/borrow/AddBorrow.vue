<template>
    <div>
        <div style="margin-bottom: 30px">新增借书记录</div>
        <el-form :inline="true" :rules="rules" ref="ruleForm" :model="formData" label-width="100px">
            <el-form-item label="标准码" prop="bookNo">
                <!-- @change用于实现我们选择bookNo之后，触发这个函数 -->
                <el-select v-model="formData.bookNo" filterable clearable placeholder="请选择" @change="selectBook">
                    <!-- :label表示前端要展示的值 :value前端往后端传递的真实值-->
                    <!-- key 相当于身份令牌，唯一的，因此一般都使用id进行绑定，保证唯一，官网推荐还是加上-->
                    <el-option v-for="item in books" :key="item.id" :label="item.bookNo" :value="item.bookNo">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="图书名称" prop="bookName">
                <el-input v-model="formData.bookName" disabled></el-input>
            </el-form-item>
            <el-form-item label="图书数量" prop="nums">
                <el-input v-model="formData.nums" disabled></el-input>
            </el-form-item>

            <el-form-item label="所需积分" prop="score">
                <el-input v-model="formData.score" disabled></el-input>
            </el-form-item>
            <br>
            <el-form-item label="用户会员码" prop="userNo">
                <el-select v-model="formData.userNo" filterable clearable placeholder="请选择" @change="selectUser">
                    <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.username">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="formData.userName" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户联系方式" prop="userPhone">
                <el-input v-model="formData.userPhone" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户积分余额" prop="account">
                <el-input v-model="formData.account" disabled></el-input>
            </el-form-item>
            <el-form-item label="借出的天数" prop="days">
                <el-input-number v-model="formData.days" :min="1" :max="30" label="借出的天数"></el-input-number>
            </el-form-item>
        </el-form>

        <div style="text-align: center;margin-top: 30px;">
            <el-button type="primary" @click="saveBorrow">提交</el-button>
        </div>


    </div>
</template>
 
<script>
import request from '@/utils/request';
import Cookies from 'js-cookie'
export default {
    name: "AddBook",
    data() {
        return {
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
            formData: { days: 1 },
            categories: [],
            books: [],
            users: [],
            rules: {
                userNo: [
                    { required: true, message: '请输入用户会员码', trigger: 'blur' }
                ],
                bookNo: [
                    { required: true, message: '请输入图书标准码', trigger: 'blur' }
                ],
            }
        }
    },
    // 每次进入到添加图书界面，先去获取所有分类信息
    created() {
        request.get('/book').then(res => {
            this.books = res.data
        })
        request.get('/user').then(res => {
            this.users = res.data.filter(v => v.status)
        })
    },
    methods: {
        selectBook() {
            const book = this.books.find(v => v.bookNo === this.formData.bookNo)
            this.formData.bookName = book.name
            this.formData.score = book.score
            this.formData.nums = book.nums
        },
        selectUser() {
            const user = this.users.find(v => v.username === this.formData.userNo)
            this.formData.userName = user.name
            this.formData.userPhone = user.phone
            this.formData.account = user.account
        },
        saveBorrow() {
            this.$refs['ruleForm'].validate((valid) => {
                // console.log(valid);
                if (valid) {
                    request.post('/borrow', this.formData).then(res => {
                        if (res.code === '200') {
                            this.$notify.success("新增成功")
                            // this.$refs['ruleForm'].resetFields()
                            this.$refs['ruleForm'].resetFields()
                            this.$router.push('/borrow')
                        } else {
                            this.$notify.error(res.msg)
                        }
                    })
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