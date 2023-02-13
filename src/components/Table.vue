<template>
  <!-- table数据为空显示 -->
  <el-empty v-if="tableData.length <= 0" style="height: 572px;" description="数据为空~" :image-size="300" />
  <div class="table" v-if="tableData.length > 0">
    <!-- table表格 -->
    <el-table :data="tableData" border stripe :height="tableData[0].username ? 400 : 510">
      <template v-for="item, key in tableData[0]" :key="key">
        <el-table-column :prop="key" :label="key"
          :width="key === 'id' ? '80px' : (key === 'fileName' || key === 'type' || key === 'user_id' || key === 'size' ? '180px' : 'none')"
          :min-width="key === 'file' ? '300px' : 'none'">
          <!-- 一、user.vue -->
          <template v-if="key === 'username'" #header>
            用户名
          </template>
          <template v-if="key === 'loginStatus'" #header>
            状态
          </template>
          <template v-if="key === 'role_id'" #header>
            角色
          </template>
          <template v-if="key === 'loginStatus'" #default="{ row }">
            <div class="flex">
              <el-button v-if="row.loginStatus" size="small" type="danger" plain
                @click="updataLoginStatus(row)">禁止登录</el-button>
              <el-button v-else size="small" type="primary" plain @click="updataLoginStatus(row)">允许登录</el-button>
              <el-button size="small" type="danger" plain @click="del(row)">删除</el-button>
            </div>
          </template>
          <template v-if="key === 'role_id'" #default="{ row }">
            <div class="flex">
              {{ (typeof row.role_id) === 'number' ? '角色名' : row.role_id }}
              <el-button size="small" type="primary" plain @click="updataRole(row)">修改角色</el-button>
            </div>
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
          <template v-if="key === 'grade'" #default="{ row }">
            <div class="flex">
              {{ row.grade }}
              <el-button type="primary" size="small" plain @click="selectP(row)">查看权限</el-button>
            </div>
          </template>
          <template v-if="key === 'power'" #default="{ row }">
            <div class="flex">
              <el-button type="primary" @click="updatePower(row)" size="small" plain>修改权限</el-button>
              <el-button type="danger" size="small" @click="delRole(row.id)" plain>删除</el-button>
            </div>
          </template>

          <!-- 三、photo.vue和video.vue -->
          <template v-if="key === 'fileName'" #header>
            文件名
          </template>
          <template v-if="key === 'type'" #header>
            类型
          </template>
          <template v-if="key === 'user_id'" #header>
            用户名
          </template>
          <template v-if="key === 'size'" #header>
            size（单位：M）
          </template>
          <template v-if="key === 'file'" #header>
            文件
          </template>
          <template v-if="key === 'size'" #default="{ row }">
            {{ (row.size / 1024 / 1024).toFixed(3) }}
          </template>
          <template v-if="key === 'file'" #default="{ row }">
            <!-- image -->
            <div class="flex" style="justify-content: space-around;" v-if="row.type.split('/')[0] === 'image'">
              <el-image class="elImage" :preview-teleported="true" :src="row.file" :zoom-rate="1.2"
                :preview-src-list="[row.file]" fit="fill" />
              <el-button size="small" type="info" @click="downloadFile(row)" plain>下载</el-button>
              <el-button size="small" type="danger" @click="deleteFile(row)" plain>删除</el-button>
            </div>
            <!-- video -->
            <div class="flex" v-else>
              <video width='220' height="100" controls="controls">
                <source :src="row.file" type="video/mp4">
                您的浏览器不支持 HTML5 video 标签。
              </video>
              <el-button size="small" type="info" @click="downloadFile(row)" plain>下载</el-button>
              <el-button size="small" type="danger" @click="deleteFile(row)" plain>删除</el-button>
            </div>
          </template>

        </el-table-column>
      </template>
    </el-table>

    <!-- user.vue：修改角色 -->
    <el-dialog v-model="dv" title="修改权限：" width="30%" :before-close="close">
      <el-select v-model="roleVal" class="m-2" placeholder="请选择权限~" size="small">
        <el-option v-for="item in allRole" :key="item.id" :label="item.roleName" :value="item.id" />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="confirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- role.vue：修改权限弹窗 -->
    <el-dialog v-model="dialogVisible" title="修改权限：" width="30%" :before-close="handleClose">
      <el-tree-select id="treeSelectEl" size="small" placement="left" :data="powerData" v-model="selectPower" multiple
        clearable />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmBtn">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" background layout="prev, pager, next" ange="handleCurrentChange"
        :total="sum ? sum : 0" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, watch, reactive, defineEmits, ref, defineExpose } from "vue"
import { baseURL } from '../constant/index'
import mainStore from "../pinia/mainStore"
import XWLRequest from "../servise/index";

const props = defineProps({
  tableData: Array,
  sum: Number,
  power: Array
})
const emit = defineEmits(["againRequest"])

// table展示数据
let tableData = reactive([])
watch(() => props.tableData, (newV, oldV) => {
  // role_id换成roleName
  if (newV[0]?.username && newV[0]?.role_id) {
    newV.forEach(async item => {
      item.role_id = await getRoleName(item.role_id)
    })
  }

  // photo添加file内容
  if (newV[0]?.fileHashName && newV[0]?.fileName) {
    newV.forEach(async item => {
      delete item["fileHashName"]
      item.file = `${baseURL}/file/getFile?file_id=${item.id}&user_id=${item.user_id}&token=${token.value}`
      item.user_id = await getUserInfo(item.user_id)
    })
  }

  tableData = newV
})

// 数据总数
let sum = ref()
watch(() => props.sum, (newV, oldV) => {
  sum.value = newV
})
// 页数变化时触发
let currentPage = ref(1)
defineExpose({ currentPage })
const handleCurrentChange = (page) => {
  currentPage.value = page
  emit("againRequest", currentPage.value)
}


// 一、user.vue
// 1、修改loginStatus
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
// 2、删除用户
const del = async (rowVal) => {
  const res = await XWLRequest.get({ url: "/user/delUser", params: { user_id: rowVal.id } })
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
// 3、获取指定角色接口
const getRoleName = async (role_id) => {
  const res = await XWLRequest.get({ url: "/roleANDmenu/getRoleById", params: { role_id } })
  if (!res.data.status) {
    ElMessage.error(res.data.message + "（获取指定角色权限）")
  }
  return res.data.message[0].roleName
}
// 4、查询所有角色（不附带权限信息）接口
let allRole = reactive([])
const getAllRole = async () => {
  const res = await XWLRequest.get({ url: "/roleANDmenu/getAllRole" })
  if (!res.data.status) {
    ElMessage.error(res.data.message + "（修改角色权限）")
  }

  allRole = res.data.message
}
getAllRole()
// 5、修改角色
const roleVal = ref('')
const dv = ref(false)
const user_id = ref('')
const updataRole = (row) => {
  user_id.value = row.id
  // 显示角色初始值
  allRole.forEach(item => {
    if (item.roleName === row.role_id) {
      roleVal.value = item.id
    }
  })
  dv.value = true
}
const confirm = async () => {
  dv.value = false
  let role_id = roleVal.value
  const res = await XWLRequest.get({ url: '/user/updateRole', params: { user_id: user_id.value, role_id } })
  if (!res.data.status) {
    ElMessage.error(res.data.message)
  } else {
    emit("againRequest", currentPage.value)
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
  }
}
const close = () => {
  dv.value = false
}

// 二、tole.vue
let powerData = reactive([
  {
    value: '1',
    label: '页面路由权限',
    children: [],
  },
  {
    value: '2',
    label: '功能权限',
    children: [],
  }
])
// 1、获取全部power
watch(() => props.power, (newV, oldV) => {
  if (newV.length > 0) {
    newV.forEach(item => {
      if (item.type === 1) {
        powerData[0].children.push({ value: item.id, label: item.name })
      } else {
        powerData[1].children.push({ value: item.id, label: item.name })
      }
    });
  }
})
// 2、获取选中的power
const selectPower = ref([])
// 3、修改权限
const dialogVisible = ref(false)
const role_id = ref()
// 3-1、弹出修改权限弹窗
const updatePower = (roleInfo) => {
  role_id.value = roleInfo.id
  selectPower.value = []
  // 显示原本的power
  roleInfo.power.forEach(item => {
    if (item.id) {
      selectPower.value.push(item.id)
    }
  });
  dialogVisible.value = true
}
// 3-2、确认修改权限
const confirmBtn = async () => {
  dialogVisible.value = false
  await handlePower(role_id.value)

  emit("againRequest", currentPage.value)
}
// 3-3、关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
}
// 3-4、执行发出修改请求
const handlePower = async (role_id) => {
  let menu_idArr = selectPower.value.join(",")

  const res = await XWLRequest.get({ url: "/roleANDmenu/updateRole", params: { role_id, menu_idArr } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
  } else {
    selectPower[role_id] = []
    ElMessage({
      message: res.data.message,
      type: 'success',
    })
  }
}
// 4、删除
const delRole = async (role_id) => {
  const res = await XWLRequest.get({ url: "/roleANDmenu/deleteRole", params: { role_id } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
  } else {
    emit("againRequest", currentPage.value)

    ElMessage({
      message: res.data.message,
      type: 'success',
    })
  }
}
// 5、查看指定角色权限
const selectP = (row) => {
  let power = []
  row.power.forEach(item => {
    power.push(item.powerName)
  });
  ElMessageBox.alert(power, '全部权限', {
    confirmButtonText: 'OK',
    callback: (action) => { },
  })
}

// 三、photo.vue和video.vue
// 1、获取token
const main = mainStore()
const token = ref(main.userInfo.token)
// 2、根据id获取用户信息
const getUserInfo = async (user_id) => {
  const res = await XWLRequest.get({ url: "/user/getUserById", params: { user_id } })

  if (!res.data.status) {
    ElMessage.error(res.data.message + "（获取指定用户权限）")
  }
  return res.data.message[0].username
}
// 3、下载文件
const downloadFile = async ({ id: file_id, fileName, type, user_id }) => {
  let userId = await getUserIdByUserName(user_id)

  let fn = fileName + "." + type.split('/')[1]

  const a = document.createElement('a')
  a.download = 'xiazai'
  a.href = `${baseURL}/file/downloadFile?file_id=${file_id}&user_id=${userId}&fileName=${fn}&token=${token.value}`
  a.click();
}
// 4、删除文件
const deleteFile = async ({ id: file_id, user_id: userName, type }) => {
  let ty = type.split('/')[0]
  let url = ty === 'image' ? 'upload/uploadPhotos/photos' : 'upload/uploadVideo/videos'

  const res = await XWLRequest.get({ url: "/file/deleteFile", params: { file_id, userName, url } })

  if (!res.data.status) {
    ElMessage.error(res.data.message + "（获取指定用户权限）")
  } else {
    emit("againRequest", currentPage.value)

    ElMessage({
      message: res.data.message,
      type: 'success',
    })
  }
}
// 5、根据userName获取用户id
const getUserIdByUserName = async (userName) => {
  const res = await XWLRequest.get({ url: "/user/getUserByuserName", params: { userName } })

  if (!res.data.status) {
    ElMessage.error(res.data.message + "（获取指定用户权限）")
  }
  return res.data.message[0].id
}

</script>

<style lang="less" scoped>
.table {
  padding: 10px;
  min-width: 400px;
}

.pagination {
  margin-top: 10px;
  margin-right: 8%;
  display: flex;
  justify-content: end;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.elImage {
  width: 160px;
  height: 100px;
}

.video-player {
  background-color: black;
  width: 100%;
}
</style>