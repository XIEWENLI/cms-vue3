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
  </div>
</template>

<script setup>
import { watch, ref } from "vue"
// mainStore的pinia
import mainStore from "../pinia/mainStore"

const main = mainStore()

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

</script>

<style lang="less" scoped>
.nav {
  width: 100%;
  padding: 7px 0 7px 0;
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
</style>
