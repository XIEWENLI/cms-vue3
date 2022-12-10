<template>
  <div class="main">
    <Nav></Nav>
    <Menu></Menu>
  </div>
  <div class="content" :class="{ open: openState }">
    content
  </div>
</template>

<script setup>
// 组件
import Nav from "../../components/Nav.vue"
import Menu from "../../components/Menu.vue"

import { computed } from "vue"
// mainStore的pinia
import { mainStore } from "../../pinia/index"

const main = mainStore()
const openState = computed(() => {
  return main.openState
})

</script>

<style lang="less" scoped>
.main {
  height: 100%;
  width: 100%;
}

.content {
  width: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-left: 63px;
  transition: padding-left 0.3s;
}

.open {
  padding-left: 200px;
}
</style>