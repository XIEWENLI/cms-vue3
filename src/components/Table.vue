<template>
  <div class="table">
    <el-table v-if="tableData.length > 0" :data="tableData" border stripe style="width: 100%">
      <template v-for="item in tableDataKey">
        <el-table-column :prop="item" :label="item" />
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { defineProps, watch, reactive } from "vue"

const props = defineProps({
  tableData: Object
})

let tableData = reactive({})
const tableDataKey = []
watch(() => props.tableData, (newV, oldV) => {
  tableData = newV
  for (const key in newV[0]) {
    tableDataKey.push(key)
  }
})

</script>

<style lang="less" scoped>
.table {
  padding: 10px;
}
</style>