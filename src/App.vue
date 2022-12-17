<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
// element-plus国际化切换成中文
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { reactive } from "vue"

const { locale } = reactive({
  locale: zhCn,
});
</script>

<style lang="less">
#app {
  height: 100%;
  width: 100%;
}
</style>