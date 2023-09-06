<template>
    <div style="width: 80%">
        <h2>编辑用户</h2>
        <el-form :inline="true" :model="formData" label-width="200px">
            <el-form-item label="UID">
                <el-input v-model="formData.username" disabled placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
                <el-input v-model="formData.age" placeholder="请输入年龄"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="formData.sex" placeholder="请输入性别"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
                <el-input v-model="formData.phone" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="地址">
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
    name: "EditUser",
    data() {
        return {
            formData: {}
        }
    },
    created() {
        // 获取编辑按钮传到路由中的id
        const id = this.$route.query.id
        request.get("/user/" + id).then(res => {
            this.formData = res.data
        })
    },
    methods: {
        saveUser() {
            request.put('/user', this.formData).then(res => {
                if (res.code === '200') {
                    this.$notify.success("修改成功")
                    this.$router.push('/user')
                    // this.formData = {}
                } else {
                    this.$notify.error(res.msg)
                }
            })
        }
    }
}
</script>
 
<style lang="scss" scoped></style>