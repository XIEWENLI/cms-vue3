<template>
  <div class="role">
    <div class="btn"><el-button type="primary" @click="openDrawer">添加角色</el-button></div>
    <Drawer :openStatus="openStatus" @closeStatus="closeStatus" :power="power" :pg="pg" @againRequest="againRequest" />
    <Table :tableData="tableData" @againRequest="againRequest" :power="power" :sum="sum" />
  </div>
</template>

<script setup>
import { ref } from "vue"

import Drawer from "./cpn/Drawer.vue"
import Table from "../../../components/Table.vue"

import XWLRequest from '../../../servise';

// 获取所有角色（包含了power）
let tableData = ref([])
const getRole = async (limit = 10, offset = 1) => {
  const res = await XWLRequest.get({ url: "/roleANDmenu/getRole", params: { limit, offset } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  tableData.value = res.data.message
}
getRole()

// 页数变化，从新请求
let pg = ref(1)
const againRequest = (pages) => {
  pg.value = pages
  let limit = ref(10)
  let offset = ref(1)
  if (pages !== 1) {
    offset.value = offset.value + limit.value * (pages - 1)
  }

  getRole(limit.value, offset.value)
}

// 获取全部power
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

// 获取表数据总数
let sum = ref()
const getSum = async () => {
  const res = await XWLRequest.get({ url: "/common/getSum", params: { tableName: 'role' } })
  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }
  sum.value = res.data.message.sum
}
getSum()

// 打开drawer
let openStatus = ref(false)
const openDrawer = () => {
  openStatus.value = !openStatus.value
}
// 关闭drawer
const closeStatus = (val) => {
  openStatus.value = val
}

</script>

<style lang="less" scoped>
.role {
  background-color: white;

  .btn {
    padding-top: 10px;
    padding-left: 10px;
  }
}
</style>