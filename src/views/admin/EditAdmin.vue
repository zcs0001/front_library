<template>
    <div style="width: 80%">
        <h2>编辑管理员</h2>
        <el-form :inline="true" :model="formData" label-width="200px">
            <el-form-item label="名称">
                <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
                <el-input v-model="formData.phone" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址">
                <el-input v-model="formData.email" placeholder="请输入邮箱地址"></el-input>
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
    name: "EditAdmin",
    data() {
        return {
            formData: {}
        }
    },
    created() {
        // 获取编辑按钮传到路由中的id
        const id = this.$route.query.id
        request.get("/admin/" + id).then(res => {
            this.formData = res.data
        })
    },
    methods: {
        saveUser() {
            request.put('/admin', this.formData).then(res => {
                if (res.code === '200') {
                    this.$notify.success("修改成功")
                    this.$router.push('/admin')
                } else {
                    this.$notify.error(res.msg)
                }
            })
        }
    }
}
</script>
 
<style lang="scss" scoped></style>