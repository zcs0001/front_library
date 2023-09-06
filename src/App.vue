<template>
  <div id="app">
    <!-- router-view用来渲染router中的路由 -->
    <!-- 侧边栏中不同选项导致index不同，对应的index.js中的路由也就不同，该路由对应的内容就会显示到router-view所在的区域，
        也就是这么的main，实现左边点击切换，右边内容变换
                    -->
    <!--  -->
    <router-view />
  </div>
</template>

<style></style>
