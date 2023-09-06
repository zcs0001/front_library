<!-- 用于单独存放前端框架，使登陆界面与这个界面平级，可以在index.js看到，不然登录界面就会嵌到这里 -->
<template>
    <div>
        <!-- 头部区域 -->
        <div class="header">
            <div class="logo" style="width: 300px;">
                <img src="@/assets/logo.png" alt="">
                <span>图书管理系统</span>
            </div>
            <div style="flex:1;text-align: right;padding-right: 20px;">
                <el-dropdown size="medium">
                    <span class="el-dropdown-link" style="cursor: pointer;">
                        {{ admin.name }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" style="margin-top: -7px;">
                        <el-dropdown-item @click.native="logout">
                            退出
                            <!-- el-dropdown-item不能添加点击事件 -->
                            <!-- <div @click="logout">退出</div> -->
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <!-- 侧边栏和主体 -->

        <!-- min-height作为最小高度 100vh是整个屏幕的大小 62px是header和margin-bottom的总和 -->
        <div style="display: flex;min-height:calc(100vh - 62px);">
            <!-- 侧边栏导航 -->
            <div class="aside">
                <!-- default-active是指默认被选中的选项;router是指按照router路由中的路径来切换；两个参数没有任何关系 -->
                <el-menu :default-active="$route.path" router class="el-menu-demo">
                    <!-- index所写的内容就是index.js中的path -->
                    <el-menu-item index="/">
                        <i class="el-icon-s-home"></i>
                        <span>首页</span>
                    </el-menu-item>
                    <!-- 二级菜单没有切换内容就不用写index 不然点第二个菜单下面的子菜单时会进入index所指向的网址，一般是不会有的-->
                    <el-submenu index="/user">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item index="/user">用户列表</el-menu-item>
                        <el-menu-item index="/addUser">用户添加</el-menu-item>
                    </el-submenu>

                    <el-submenu index="/admin">
                        <template slot="title">
                            <i class="el-icon-user-solid"></i>
                            <span>管理员管理</span>
                        </template>
                        <el-menu-item index="/admin">管理员列表</el-menu-item>
                        <el-menu-item index="/addAdmin">管理员添加</el-menu-item>
                    </el-submenu>

                    <el-submenu index="/category">
                        <template slot="title">
                            <i class="el-icon-s-operation"></i>
                            <span>图书分类管理</span>
                        </template>
                        <el-menu-item index="/category">图书分类列表</el-menu-item>
                        <el-menu-item index="/addCategory">图书分类添加</el-menu-item>
                    </el-submenu>

                    <el-submenu index="/book">
                        <template slot="title">
                            <i class="el-icon-notebook-1"></i>
                            <span>图书管理</span>
                        </template>
                        <el-menu-item index="/book">图书列表</el-menu-item>
                        <el-menu-item index="/addBook">图书添加</el-menu-item>

                    </el-submenu>

                    <el-submenu index="/borrow">
                        <template slot="title">
                            <i class="el-icon-document-copy"></i>
                            <span>借书管理</span>
                        </template>
                        <el-menu-item index="/borrow">借书列表</el-menu-item>
                        <el-menu-item index="/addBorrow">借书添加</el-menu-item>
                    </el-submenu>

                    <el-submenu index="/retur">
                        <template slot="title">
                            <i class="el-icon-document"></i>
                            <span>还书管理</span>
                        </template>
                        <el-menu-item index="/retur">还书列表</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>

            <div class="main">
                <!-- router-view用来渲染router中的路由 -->
                <!-- 侧边栏中不同选项导致index不同，对应的index.js中的路由也就不同，该路由对应的内容就会显示到router-view所在的区域，
        也就是这么的main，实现左边点击切换，右边内容变换
                                                                                                                                                                                                                                                                                                -->
                <!-- 就是Layout的子路由 -->
                <router-view />
            </div>
        </div>
    </div>
</template>
 
<script>
import Cookies from "js-cookie"
export default {
    name: "",
    data() {
        return {
            // 如果Cookie中存在admin，就用JSON.parse解析出来，否则就给一个空对象，admin就是再login时存在Cookie中的名字
            admin: Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : {}
        }
    },
    methods: {
        logout() {
            // 清除浏览器用户数据
            Cookies.remove("admin")
            // 退出的时候跳转的登录界面
            this.$router.push("/login")

        }
    }
}
</script>
 
<style scoped>
.header {
    height: 60px;
    line-height: 60px;
    background-color: white;
    margin-bottom: 2px;
    display: flex;
}

.header img {
    width: 40px;
    position: relative;
    top: 10px;
    left: 20px;
}

.header .logo span {
    font-size: 24px;
    margin-left: 30px;
}

.aside {
    width: 300px;
    overflow: hidden;
    margin-right: 2px;
    background-color: white;
}

.main {
    flex: 1;
    background-color: white;
    padding: 20px;
}
</style>