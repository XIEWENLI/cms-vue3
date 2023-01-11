<template>
  <div class="nav" :class="{ open2: openState }">
    <el-breadcrumb separator="" style="font-size: 20px;">
      <el-breadcrumb-item>
        <a>
          <i-ep-fold v-if="openState" @click="reverseOpen"></i-ep-fold>
          <i-ep-expand v-else @click="reverseOpen"></i-ep-expand>
        </a>
      </el-breadcrumb-item>
      <el-breadcrumb-item style="padding-top: 10px;">{{ url }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="userInfo">
      <h3>用户名：{{ username }}</h3>
      <a href="JavaScript:0" @click="signOut">退出登录</a>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from "vue"
import { useRouter } from 'vue-router'
// mainStore的pinia
import mainStore from "../pinia/mainStore"
import localCache from '../utils/cache'

const main = mainStore()

const username = ref(main.userInfo.username)

const url = ref("/main")
watch(() => main.URL, (newV, oldV) => {
  url.value = newV
})

const openState = ref(true)
watch(() => main.openState, (newV, oldV) => {
  openState.value = newV
})
const reverseOpen = () => {
  main.reverseOpenState()
}

// 退出
const signOut = () => {
  localCache.deleteCache('userInfo')
  location.replace('/#/login')
}

</script>

<style lang="less" scoped>
.nav {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  padding: 4px 0 4px 0;
  box-sizing: border-box;
  background-color: white;
  padding-left: 63px;
  transition: padding-left 0.3s;

  a {
    display: block;
    margin-top: 3px;
    margin-left: 10px;
    font-size: 28px;
  }
}

.open2 {
  padding-left: 200px;
}

.userInfo {
  position: absolute;
  right: 30px;
  top: 12px;
  display: flex;

  a {
    margin-top: 1.8px;
    font-size: 16px;
  }
}
</style>
