<template>
  <div class="menu">
    <el-menu :default-active="actionIndex" active-text-color="#ffd04b" text-color="#fff" background-color="#545c64"
      class="el-menu-vertical-demo" :collapse="!openState">
      <div class="title">
        <img src="../../public/vite.svg" alt="图标显示错误">
        <h3 :class="{ h3None: !openState }">node+vue</h3>
      </div>
      <el-menu-item v-for="(item, i) in oneLevelMenu" ref="el" :index="i + 1 + ''" @click="menuHandle">
        <el-icon>
          <template v-if="item.iconName === 'Histogram'">
            <Histogram />
          </template>
          <template v-if="item.iconName === 'User'">
            <User />
          </template>
          <template v-if="item.iconName === 'UserFilled'">
            <UserFilled />
          </template>
          <template v-if="item.iconName === 'Folder'">
            <Folder />
          </template>
          <template v-if="item.iconName === 'FolderOpened'">
            <FolderOpened />
          </template>
        </el-icon>
        <template #title>{{ item.name }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// mainStore的pinia
import mainStore from "../pinia/mainStore"

const router = useRouter()
const main = mainStore()

let openState = ref(true)
watch(() => main.openState, (newV, oldV) => {
  openState.value = newV
})

// 一级路由
const oneLevelMenu = main.oneLevelMenu

let actionIndex = ref("")
watch(() => main.actionIndex, (newV, oldV) => {
  actionIndex.value = newV
})

const menuHandle = (key) => {
  actionIndex.value = key.index
  let path = oneLevelMenu[key.index - 1].menuURL
  main.URL = path
  router.replace(path)
}


</script>

<style>
.menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 99;
}

.menu .el-menu-item {
  font-size: 17px;
}

.menu .title {
  display: flex;
  padding-left: 15px;
  padding-top: 10px;
}

.menu .title h3 {
  color: white;
}

.h3None {
  display: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu-vertical-demo {
  height: 100%;
}
</style>
