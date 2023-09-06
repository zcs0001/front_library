<template>
    <div style="height: 100vh; overflow: hidden; position: relative">

        <el-card class="cover" v-if="loginAdmin.id">
            <slide-verify :l="42" :r="10" :w="310" :h="155" slider-text="向右滑动" @success="onSuccess" @fail="onFail"
                @refresh="onRefresh"></slide-verify>
        </el-card>

        <div
            style="width: 500px; height: 400px; background-color: white; border-radius: 10px;
                                                                                                                                                                              margin: 150px auto; padding:50px">
            <div style="margin: 30px; text-align: center; font-size: 30px; font-weight: bold; color: dodgerblue">登 录</div>
            <el-form :model="admin" :rules="rules" ref="loginForm">
                <el-form-item prop="name">
                    <el-input placeholder="请输入账号" prefix-icon="el-icon-user" size="medium" v-model="admin.name"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" show-password prefix-icon="el-icon-lock" size="medium"
                        v-model="admin.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%" size="medium" type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
  
<script>
import request from "@/utils/request";
import Cookies from "js-cookie"
export default {
    name: 'LOGIN',
    data() {
        return {
            loginAdmin: {},
            admin: {},
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        onSuccess() {
            // this.$notify.success("登录成功")
            // // 设置Cookie，且后端返回的对象不为空时，才存Cookie
            // if (res.data !== null) {
            //     // 将后台返回的对象以字符串的形式存到Cookie中，因为Cookie只能存字符串
            //     // 存到Cookie中我们可以取出它其中的数据，比如取出当前用户的用户名并显示在页面上
            //     // admin则是设置存在Cookie中的名字
            //     Cookies.set("admin", JSON.stringify(res.data))
            // }
            // this.$router.push('/')
            Cookies.set('admin', JSON.stringify(this.loginAdmin))
            this.$router.push('/')
            this.$notify.success("登录成功")
        },
        onFail() {
            console.log('fail')
        },
        onRefresh() {
            console.log('refresh')
        },
        login() {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    request.post('/admin/login', this.admin).then(res => {
                        // console.log(res);
                        // 如果登录成功，获取到返回值，滑块组件就出现了
                        if (res.code === '200') {
                            this.loginAdmin = res.data  // 滑块组件就出现了
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
  
<style>
.cover {
    width: fit-content;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}
</style>