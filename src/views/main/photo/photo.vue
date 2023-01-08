<template>
  <div class="photo">
    <Table :tableData="tableData" @againRequest="againRequest" :sum="sum" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import XWLRequest from "../../../servise/index"
import Table from "../../../components/Table.vue"

// 获取图片信息
let tableData = ref([])
const getImage = async (limit = 10, offset = 0) => {
  const res = await XWLRequest.get({ url: '/file/getFileInfo', params: { type: 'image', limit, offset } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  // 对象数组
  tableData.value = res.data.message
}
getImage()

// 获取表数据总数
let sum = ref()
const getSum = async () => {
  const res = await XWLRequest.get({ url: "/common/getSum", params: { tableName: 'file', type: "image" } })
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

  getImage(limit.value, offset.value)
}
</script>

<style lang="less" scoped>
.photo {
  background-color: white;
}
</style>