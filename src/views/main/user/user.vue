<template>
  <div class="user">
    <commonTable :tableDataCommon="tableDataCommon" @againRequestCommon="againRequestCommon" />
    <Table :tableData="tableData" @againRequest="againRequest" :sum="sum" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import commonTable from "./cpn/commonTable.vue"
import Table from "../../../components/Table.vue"
import XWLRequest from "../../../servise/index"

// 获取common表
let tableDataCommon = ref([])
const againRequestCommon = async () => {
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
againRequestCommon()

// user表
let tableData = ref([])
const request = async (limit = 10, offset = 0) => {
  const res = await XWLRequest.get({ url: '/user/getUsers', params: { limit, offset } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  // 对象数组
  tableData.value = res.data.message
}
request()

// 获取表数据总数
let sum = ref()
const getSum = async () => {
  const res = await XWLRequest.get({ url: "/common/getSum", params: { tableName: 'user' } })
  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }
  sum.value = res.data.message.sum
}
getSum()

// 页数变化，从新请求
const againRequest = (pages) => {
  let limit = ref(10)
  let offset = ref(0)
  if (pages !== 1) {
    offset.value = offset.value + limit.value * (pages - 1)
  }

  request(limit.value, offset.value)
}

</script>

<style lang="less" scoped>
.user {
  background-color: white;
}
</style>