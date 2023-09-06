<template>
    <div style="width: 80%">
        <div style="margin-bottom: 30px">新增图书</div>
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
                <!-- 要注意，获得类别信息是从CategoryController中获得的，而要存到的地方是BookController -->
                <!-- 实现过程为： -->
                <!-- 先在data中定义一个categories，用于保存从CategoryController获得的分类信息-->
                <!-- 然后将:options属性设置为categories实例属性,要注意,是根据其中的children属性来绑定下一级的属性,所以必须要有children，根据children选择 -->
                <!-- 使用props属性来传递参数,将value和label属性都设置为"name",比如选择历史文化时,它的name为 name:'历史文化',则选项的值是对应'历史文化',选项的文本标签也是'历史文化' -->
                <!-- 如果我们选择了历史文化,唐朝文化,那么categories的结果就是['历史文化','唐朝文化'],值是一个长度为2的数组 -->
                <!-- v-model="formData.categories"的作用只是将categories中的信息绑定到formData中,在添加图书的时候将类别信息传给后端,跟级联选择器无关 -->
                <!-- 最终当用户在选择器中选择一个值时，它会更新绑定的Vue实例属性，并且可以使用绑定的值来更新其他Vue组件或视图。 -->
                <el-cascader style="width: 220px" :props="{ value: 'name', label: 'name' }" v-model="formData.categories"
                    :options="categories"></el-cascader>
            </el-form-item>
            <el-form-item label="标准码" prop="bookNo">
                <el-input v-model="formData.bookNo" placeholder="请输入标准码"></el-input>
            </el-form-item>
            <el-form-item label="借书积分" prop="score">
                <el-input-number v-model="formData.score" :min="10" :max="1000" label="所需积分"></el-input-number>
            </el-form-item>
            <el-form-item label="数量" prop="nums">
                <el-input v-model="formData.nums" placeholder="请输入数量"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="封面" prop="cover">
                <!-- :action后端地址，后端必须要有这个接口 -->
                <!-- cover中存的是图片链接文字 -->
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
    name: "AddBook",
    data() {
        const checkNums = (rule, value, callback) => {
            value = parseInt(value)
            if (value < 0 || value >= 1000) {
                callback(new Error('请输入大于等于0小于1000的整数'));
            }
            callback()
        };
        return {
            admin: Cookies.get('admin') ? JSON.parse(Cookies.get('admin')) : {},
            formData: { score: 10, cover: '' },
            categories: [],
            rules: {
                name: [
                    { required: true, message: '请输入图书名称', trigger: 'blur' }
                ],
                bookNo: [
                    { required: true, message: '请输入图书标准码', trigger: 'blur' }
                ],
                score: [
                    { validator: checkNums, trigger: 'blur' }
                ],
                nums: [
                    { required: true, message: '请输入数量', trigger: 'blur' },
                    { validator: checkNums, trigger: 'blur' }
                ]
            }
        }
    },
    // 每次进入到添加图书界面，先去获取所有分类信息
    created() {
        request.get('/category/tree').then(res => {
            // console.log(res);
            this.categories = res.data
        })
    },
    methods: {
        saveBook() {
            this.$refs['ruleForm'].validate((valid) => {
                // console.log(valid);
                if (valid) {
                    request.post('/book', this.formData).then(res => {
                        if (res.code === '200') {
                            this.$notify.success("新增成功")
                            // this.$refs['ruleForm'].resetFields()
                            this.$refs['ruleForm'].resetFields()
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