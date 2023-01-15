<template>
  <div class="form">
    <el-form ref="formDataRef" :model="formData" status-icon :rules="rules" label-width="85px" class="demo-formData">
      <el-form-item label="账&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp号：" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="密&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp码：" prop="password">
        <el-input v-model="formData.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formDataRef)">登录</el-button>
        <el-button @click="resetForm(formDataRef)">重置</el-button>
        <el-button @click="jumpRegister">注册页面</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script  setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import XWLRequest from '../../../servise/index'
import localCache from '../../../utils/cache'
import mainStore from "../../../pinia/mainStore"

const main = mainStore()
const router = useRouter()
const formDataRef = ref()

const validateUsername = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('用户名不能为空！！！'))
  } else {
    if (value.length > 10 || value.length < 5) {
      callback(new Error('用户名长度5-10位！！！'))
      return
    }
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('密码不能为空！！！'))
  } else {
    if (value.length > 10 || value.length < 5) {
      callback(new Error('密码长度5-10位！！！'))
      return
    }
    callback()
  }
}

const formData = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [{ validator: validateUsername, trigger: 'change' }],
  password: [{ validator: validatePassword, trigger: 'change' }],
})

// 登录功能
const submitForm = (formEl) => {
  if (!formEl) return
  const rl = /^[\da-z]+$/i
  if (!rl.test(formData.username)) {
    ElMessage.error('用户名由字母或数字组成~');
    return
  }
  formEl.validate((valid) => {
    if (valid) {
      XWLRequest.post({ url: '/user/login', data: { username: formData.username, password: formData.password } })
        .then(res => {
          let result = res.data
          if (result.status) {
            // 存储用户相关信息
            localCache.setCache("userInfo", JSON.stringify(result))
            main.userInfo = result

            ElMessage({
              message: '登录成功！！！',
              type: 'success',
            })

            router.replace("/main")
          } else {
            ElMessage.error(result.message)
          }
        })
        .catch(err => { console.log(err); })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const jumpRegister = () => {
  router.replace("/register")
}
</script>
<style scoped>
.form {
  margin-left: -8%;
}
</style>