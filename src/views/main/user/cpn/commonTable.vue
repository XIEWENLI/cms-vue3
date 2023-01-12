<template>
  <div class="commonTable">
    <el-table v-if="tableDataCommon.length > 0" :data="tableDataCommon" border stripe style="width: 100%">
      <template v-for="item, key in tableDataCommon[0]" :key="key">
        <el-table-column :prop="key" :label="key">
          <!-- user.vue修改status -->
          <template v-if="key === 'loginStatus_all_admin'" #header>
            管理员登录状态
          </template>
          <template v-if="key === 'registerStatus_all_admin'" #header>
            管理员注册状态
          </template>
          <template v-if="key === 'loginStatus_all_user'" #header>
            普通用户登录状态
          </template>
          <template v-if="key === 'registerStatus_all_user'" #header>
            普通用户注册状态
          </template>

          <template #default="{ row }">
            <el-button v-if="!Number(row[key])" size="small" type="primary" plain
              @click="updataStatus(row, key)">允许登录</el-button>
            <el-button v-else size="small" type="danger" plain @click="updataStatus(row, key)">禁止登录</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { reactive, watch, defineProps, defineEmits } from "vue"

import XWLRequest from "../../../../servise";

const props = defineProps({
  tableDataCommon: Array
})

const emit = defineEmits(["requestCommon"])

let tableDataCommon = reactive([])
watch(() => props.tableDataCommon, (newV, oldV) => {
  tableDataCommon = newV
})

const updataStatus = async (rowVal, keyVal) => {
  let status = Number(rowVal[keyVal]) ? 0 : 1

  const res = await XWLRequest.get({ url: "/common/updateStatus", params: { fieldName: keyVal, status } })
  if (!res.data.status) {
    ElMessage.error(res.data.message)
  } else {
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
    emit("requestCommon")
  }

}

</script>

<style lang="less" scoped>
.commonTable {
  padding: 10px;
  border-bottom: 10px #d7d9db solid;
}
</style>