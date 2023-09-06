<template>
    <div style="width: 80%">
        <h2>新增分类</h2>
        <el-form :inline="true" :model="formData" label-width="200px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
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
    name: "AddCategory",
    data() {
        return {
            formData: {},
        }
    },
    methods: {
        saveCategory() {
            request.post('/category', this.formData).then(res => {
                if (res.code === '200') {
                    this.$notify.success("新增成功")
                    this.formData = {}
                } else {
                    this.$notify.error(res.msg)
                }
            })

        }
    }
}
</script>
 
<style lang="scss" scoped></style>