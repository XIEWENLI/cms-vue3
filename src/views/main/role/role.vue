<template>
  <div class="role">
    <div class="hd">
      <Input @search="search" :placeholderVal="placeholderVal" />
      <div class="btn">
        <el-button type="primary" @click="openDrawer">添加角色</el-button>
      </div>
    </div>
    <Drawer :openStatus="openStatus" @closeStatus="closeStatus" :power="power" :pg="pg" @againRequest="againRequest" />
    <Table ref="tableEl" :tableData="tableData" @againRequest="againRequest" :power="power" :sum="sum" />
  </div>
</template>

<script setup>
import { ref } from "vue"

import Drawer from "./cpn/Drawer.vue"
import Table from "../../../components/Table.vue"

import XWLRequest from '../../../servise';
import Input from "../../../components/Input.vue"

// table.vue
// 1、table.vue的placeholder值
const placeholderVal = ref('请输入角色名~')
// 2、搜索
const tableEl = ref(null)
const search = (inputVal) => {
  tableEl.value.currentPage = 1
  againRequest(1, inputVal)
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

// 获取所有角色（包含了power）
let tableData = ref([])
const getRole = async (limit = 10, offset = 1, inputVal) => {
  if (inputVal !== undefined) {
    sum.value = 10
  } else {
    getSum()
  }

  const res = await XWLRequest.get({ url: "/roleANDmenu/getRole", params: { inputVal, limit, offset } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  tableData.value = res.data.message
}
getRole()


// 页数变化，从新请求
let pg = ref(1)
const againRequest = (pages, inputVal) => {
  inputVal = inputVal === '' ? undefined : inputVal
  pg.value = pages
  let limit = ref(10)
  let offset = ref(1)
  if (pages !== 1) {
    offset.value = offset.value + limit.value * (pages - 1)
  }



  if (inputVal === undefined) {
    getRole(limit.value, offset.value)
  } else {
    getRole(limit.value, offset.value, inputVal)
  }
}

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

  .hd {
    display: flex;

    .btn {
      padding-top: 10px;
      padding-left: 10px;
    }
  }

}
</style>