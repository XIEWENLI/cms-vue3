<template>
  <div class="photo">
    <div style="display: flex;">
      <Input @search="search" :placeholderVal="placeholderVal" />
      <el-button style="margin-left: 10px;margin-top: 10px;" type="primary" @click="dialogVisible = true">上传</el-button>
    </div>
    <Table ref="tableEl" :tableData="tableData" @againRequest="againRequest" :sum="sum" />
  </div>

  <!-- 上传弹窗 -->
  <el-dialog v-model="dialogVisible" title="上传界面" width="30%" :before-close="handleClose">
    <Upload @againRequest="againRequest" :accept="accept" />
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import XWLRequest from "../../../servise/index"
import Table from "../../../components/Table.vue"
import Input from "../../../components/Input.vue"
import Upload from "../../../components/Upload.vue"

// 上传弹窗
const dialogVisible = ref(false)
// 关闭
const handleClose = (done) => {
  done()
}
// 上传文件类型
const accept = ref('.png,.jpeg,.jpg')

// table.vue
// 1、table.vue的placeholder值
const placeholderVal = ref('请输入用户名~')
// 2、搜索
const tableEl = ref(null)
const search = (inputVal) => {
  tableEl.value.currentPage = 1
  againRequest(1, inputVal)
}

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

// 获取图片信息
let tableData = ref([])
const getImage = async (limit = 10, offset = 0, inputVal) => {
  if (inputVal !== undefined) {
    sum.value = 10
  } else {
    getSum()
  }

  const res = await XWLRequest.get({ url: '/file/getFileInfo', params: { type: 'image', inputVal, limit, offset } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  // 对象数组
  tableData.value = res.data.message
}
getImage()

// 页数变化，从新请求
const againRequest = (pages = tableEl.value.currentPage, inputVal) => {
  inputVal = inputVal === '' ? undefined : inputVal
  let limit = ref(10)
  let offset = ref(0)
  if (pages !== 1) {
    offset.value = offset.value + limit.value * (pages - 1)
  }

  getSum()

  if (inputVal === undefined) {
    getImage(limit.value, offset.value)
  } else {
    getImage(1000, offset.value, inputVal)
  }
}

</script>

<style lang="less" scoped>
.photo {
  background-color: white;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>