<template>
  <div class="table">
    <!-- 表格 -->
    <el-table v-if="tableData.length > 0" :data="tableData" border stripe style="width: 100%">
      <template v-for="item, key in tableData[0]" :key="key">
        <el-table-column :prop="key" :label="key">
          <!-- 一、user.vue -->
          <template v-if="key === 'loginStatus'" #header>
            状态
          </template>
          <template v-if="key === 'loginStatus'" #default="{ row }">
            <el-button v-if="row.loginStatus" size="small" type="danger" plain
              @click="updataLoginStatus(row)">禁止登录</el-button>
            <el-button v-else size="small" type="primary" plain @click="updataLoginStatus(row)">允许登录</el-button>
            <el-button size="small" type="danger" plain @click="del(row)">删除</el-button>
          </template>

          <!-- 二、role.vue -->
          <template v-if="key === 'roleName'" #header>
            角色名
          </template>
          <template v-if="key === 'grade'" #header>
            级别
          </template>
          <template v-if="key === 'power'" #header>
            权限
          </template>
          <template v-if="key === 'power'" #default="{ row }">
            <el-tree-select v-model="value" :data="data" multiple show-checkbox />
            <el-divider />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="pagination">
      <!-- 分页 -->
      <el-pagination v-model:current-page="currentPage" background layout="prev, pager, next" :total="sum ? sum : 0"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch, reactive, defineEmits, ref } from "vue"

import XWLRequest from "../servise/index";

const props = defineProps({
  tableData: Array,
  sum: Number,
  power: Array
})
const emit = defineEmits(["againRequest"])

let tableData = reactive([])
watch(() => props.tableData, (newV, oldV) => {
  tableData = newV
})

let sum = ref()
watch(() => props.power, (newV, oldV) => {
  console.log(newV);
})

// 页数变化时触发
let currentPage = ref(1)
const handleCurrentChange = (page) => {
  currentPage.value = page
  emit("againRequest", currentPage.value)
}

// 一、user.vue
// （1）修改loginStatus
const updataLoginStatus = async (rowVal) => {
  let loginStatus = rowVal.loginStatus ? 0 : 1
  const res = await XWLRequest.get({ url: "/user/updateUserLoginStatus", params: { user_id: rowVal.id, loginStatus } })
  if (!res.data.status) {
    ElMessage.error(res.data.message)
  } else {
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
    emit("againRequest", currentPage.value)
  }
}
// （2）删除用户
const del = async (rowVal) => {
  const res = await XWLRequest.get({ url: "/user/delUser", params: { user_id: rowVal.id } })
  if (!res.data.status) {
    ElMessage.error(res.data.message)
  } else {
    currentPage.value = 1
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
    emit("againRequest", currentPage.value)
  }
}

// 二、tole.vue
let data = [{
  value: '1',
  label: 'Level one 1',
},]
const value = ref()
watch(() => props.sum, (newV, oldV) => {
  sum.value = newV
})
// （1）

</script>

<style lang="less" scoped>
.table {
  padding: 10px;
}

.pagination {
  margin-top: 10px;
  margin-right: 12%;
  display: flex;
  justify-content: end;
}
</style>