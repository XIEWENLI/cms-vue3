<template>
  <div class="main">
    <Nav />
    <Menu />
  </div>
  <div class="content" :class="{ open: openState }">
    <router-view></router-view>
  </div>
</template>

<script setup>
// 组件
import Nav from "../../components/Nav.vue"
import Menu from "../../components/Menu.vue"

import { watch, ref } from "vue"
// mainStore的pinia
import mainStore from "../../pinia/mainStore"
import { reflectPage } from "../../pinia/mainStore"

// 添加动态路由
reflectPage()

const main = mainStore()
const openState = ref(true)
watch(() => main.openState, (newV, oldV) => {
  openState.value = newV
})

</script>

<style lang="less" scoped>
.main {
  height: 100%;
  width: 100%;
}

.content {
  height: 100%;
  width: 95%;
  box-sizing: border-box;
  padding-left: 63px;
  transition: padding-left 0.3s;
  margin: 0 auto;
  margin-top: 10px;
}

.open {
  padding-left: 200px;
}
</style>