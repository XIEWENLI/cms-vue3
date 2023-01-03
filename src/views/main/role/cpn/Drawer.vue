<template>
  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>添加角色</h4>
    </template>
    <template #default>
      <div>
        <el-input v-model="roleName" placeholder="请输入角色名" />
        <el-input type="Number" v-model="grade" placeholder="请输入级别" />
        <el-tree-select id="treeSelectEl" placement="left" :data="powerData" v-model="selectPower" multiple clearable />
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">添加</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits, reactive } from 'vue'
import XWLRequest from '../../../../servise/index';

const props = defineProps({
  openStatus: Boolean,
  power: Array,
  pg: Number
})
const emit = defineEmits(["closeStatus", "againRequest"])

const drawer = ref(false)
watch(() => props.openStatus, (newV, oldV) => {
  drawer.value = newV
})
watch(() => drawer.value, (newV, oldV) => {
  emit("closeStatus", newV)
})

// 传递过来的页数
let pg = ref(1)
watch(() => props.pg, (newV, oldV) => {
  pg.value = newV
})

const roleName = ref('')
const grade = ref('')
const selectPower = ref([])

// 所有权限展示数据
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

// 取消
function cancelClick() {
  drawer.value = false
}
// 确认
async function confirmClick() {
  if (roleName.value && grade.value) {
    let menu_idArr = selectPower.value.join(",")

    const res = await XWLRequest.get({ url: "/roleANDmenu/createRole", params: { roleName: roleName.value, grade: grade.value, menu_idArr } })

    if (!res.data.status) {
      ElMessage.error(res.data.message)
    } else {
      emit('againRequest', pg.value)

      drawer.value = false
      roleName.value = ""
      grade.value = ""
      selectPower.value = []

      ElMessage({
        message: res.data.message,
        type: 'success',
      })
    }
  } else {
    ElMessage.error("角色名和级别不能为空~")
  }
}
</script>
