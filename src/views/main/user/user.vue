<template>
  <div class="user">
    <Table :tableData="tableData" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import Table from "../../../components/Table.vue"
import XWLRequest from "../../../servise/index"

let tableData = ref({})
XWLRequest.get({ url: '/user/getUsers' })
  .then(res => {
    // 传递对象数组[{}...]
    tableData.value = res.data.message
  }).catch(err => {
    console.log(err);
  })



</script>

<style lang="less" scoped>
.user {
  background-color: white;
}
</style>