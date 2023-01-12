<template>
  <div class="user">
    <commonTable :tableDataCommon="tableDataCommon" @requestCommon="requestCommon" />
    <Input @search="search" :placeholderVal="placeholderVal" />
    <Table ref="tableEl" :tableData="tableData" @againRequest="againRequest" :sum="sum" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import commonTable from "./cpn/CommonTable.vue"
import Table from "../../../components/Table.vue"
import XWLRequest from "../../../servise/index"
import Input from "../../../components/Input.vue"

// table.vue
// 1、table.vue的placeholder值
const placeholderVal = ref('请输入用户名~')
// 2、搜索
const tableEl = ref(null)
const search = (inputVal) => {
  tableEl.value.currentPage = 1
  againRequest(1, inputVal)
}

// 获取common表
let tableDataCommon = ref([])
const requestCommon = async () => {
  const rq1 = XWLRequest.get({ url: '/common/getStatus', params: { fieldName: "loginStatus_all_admin" } })
  const rq2 = XWLRequest.get({ url: '/common/getStatus', params: { fieldName: "registerStatus_all_admin" } })
  const rq3 = XWLRequest.get({ url: '/common/getStatus', params: { fieldName: "loginStatus_all_user" } })
  const rq4 = XWLRequest.get({ url: '/common/getStatus', params: { fieldName: "registerStatus_all_user" } })
  Promise.all([rq1, rq2, rq3, rq4]).then(res => {
    if (!res[0].data.status) {
      ElMessage.error(res[0].data.message)
      return
    }

    let arr = {}
    for (const item of res) {
      for (const item2 in item.data.message) {
        arr[item2] = item.data.message[item2]
      }
    }
    tableDataCommon.value = [arr]
  }).catch(err => {
    console.log(err);
  })
}
requestCommon()

// 获取表数据总数
let sum = ref()
const getSum = async () => {
  const res = await XWLRequest.get({ url: "/common/getSum", params: { tableName: 'user' } })
  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }
  sum.value = res.data.message.sum - 1
}
getSum()

// user表
let tableData = ref([])
const getUsers = async (limit = 10, offset = 0, inputVal) => {
  if (inputVal !== undefined) {
    sum.value = 10
  } else {
    getSum()
  }

  const res = await XWLRequest.get({ url: '/user/getUsers', params: { inputVal, limit, offset } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  // 对象数组
  tableData.value = res.data.message
}
getUsers()

// 页数变化，从新请求
const againRequest = (pages, inputVal) => {
  inputVal = inputVal === '' ? undefined : inputVal
  let limit = ref(10)
  let offset = ref(0)
  if (pages !== 1) {
    offset.value = offset.value + limit.value * (pages - 1)
  }

  getSum()

  if (inputVal === undefined) {
    getUsers(limit.value, offset.value)
  } else {
    getUsers(limit.value, offset.value, inputVal)
  }
}

</script>

<style lang="less" scoped>
.user {
  background-color: white;
}
</style>