<template>
    <div style="width: 80%">
        <h2>新增用户</h2>
        <el-form :inline="true" :model="formData" :rules="rules" ref="ruleForm" label-width="200px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <!-- <el-form-item label="用户名">
                <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
            </el-form-item> -->
            <el-form-item label="年龄" prop="age">
                <el-input v-model="formData.age" placeholder="请输入年龄"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio v-model="formData.sex" label="男">男</el-radio>
                <el-radio v-model="formData.sex" label="女">女</el-radio>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="formData.address" placeholder="请输入地址"></el-input>
            </el-form-item>
        </el-form>

        <div style="text-align: center;margin-top: 30px;">
            <el-button type="primary" @click="saveUser">提交</el-button>
        </div>


    </div>
</template>
 
<script>
import request from '@/utils/request';
export default {
    name: "AddUser",
    data() {
        const checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('年龄不能为空'));
            }
            if (!/^[0-9]+$/.test(value)) {
                callback(new Error('请输入数字'));
            }
            if (parseInt(value) > 120 || parseInt(value) <= 0) {
                callback(new Error("请正确输入年龄"))
            }
            // callback必须被调用
            callback()
        };
        const checkPhone = (rule, value, callback) => {
            if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
                callback(new Error('请输入合法的手机号'));
            }
            callback()
        };
        return {
            formData: { sex: '男' },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                age: [
                    { validator: checkAge, trigger: 'blur' },
                ],
                phone: [
                    { validator: checkPhone, trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        saveUser() {
            this.$refs['ruleForm'].validate((valid) => {
                console.log(valid);
                if (valid) {
                    request.post('/user', this.formData).then(res => {
                        if (res.code === '200') {
                            this.$notify.success("新增成功")
                            // this.$refs['ruleForm'].resetFields()
                            this.formData = { sex: '男' }
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