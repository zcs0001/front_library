<template>
    <div style="width: 80%">
        <h2>编辑分类</h2>
        <el-form :inline="true" :model="formData" label-width="200px">
            <el-form-item label="名称">
                <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="formData.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>

        <div style="text-align: center;margin-top: 30px;">
            <el-button type="primary" @click="saveCategory">提交</el-button>
        </div>


    </div>
</template>
 
<script>
import request from '@/utils/request';
export default {
    name: "EditCategory",
    data() {
        return {
            formData: {}
        }
    },
    created() {
        // 获取编辑按钮传到路由中的id
        const id = this.$route.query.id
        request.get("/category/" + id).then(res => {
            this.formData = res.data
        })
    },
    methods: {
        saveCategory() {
            request.put('/category', this.formData).then(res => {
                if (res.code === '200') {
                    this.$notify.success("修改成功")
                    this.$router.push('/category')
                } else {
                    this.$notify.error(res.msg)
                }
            })
        }
    }
}
</script>
 
<style lang="scss" scoped></style>