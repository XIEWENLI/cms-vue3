<template>
  <div class="role">
    角色管理
    <Table :tableData="tableData" :power="power" />
  </div>
</template>

<script setup>
import { ref } from "vue"

import XWLRequest from '../../../servise';
import Table from "../../../components/Table.vue"

// 获取所有角色（包含了power）
let tableData = ref([])
const getRole = async () => {
  const res = await XWLRequest.get({ url: "/roleANDmenu/getRole" })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }
  console.log(res.data.message);

  // 对象数组
  tableData.value = res.data.message
}
getRole()

// 获取权限
let power = ref([])
const getPower = async () => {
  const res = await XWLRequest.get({ url: "/roleANDmenu/getPower" })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  power.value = res.data.message
}
getPower()

</script>

<style lang="less" scoped>
.role {
  background-color: white;
}
</style>