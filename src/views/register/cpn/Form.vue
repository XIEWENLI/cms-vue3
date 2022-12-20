<template>
  <div class="form">
    <el-form ref="formDataRef" :model="formData" status-icon :rules="rules" label-width="100px" class="demo-formData">
      <el-form-item label="账&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp号：" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="密&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp码：" prop="password">
        <el-input v-model="formData.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="重复密码：" prop="password2">
        <el-input v-model="formData.password2" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formDataRef)">注册</el-button>
        <el-button @click="resetForm(formDataRef)">重置</el-button>
        <el-button @click="jumpLogin">登录界面</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script  setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import XWLRequest from '../../../servise/index'

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
const validatePassword2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('密码不能为空！！！'))
  } else {
    if (value.length > 10 || value.length < 5) {
      callback(new Error('密码长度5-10位！！！'))
      return
    }
    if (value !== formData.password) {
      callback(new Error('两次密码不相同！！！'))
      return
    }
    callback()
  }
}

const formData = reactive({
  username: '',
  password: '',
  password2: '',
})

const rules = reactive({
  username: [{ validator: validateUsername, trigger: 'change' }],
  password: [{ validator: validatePassword, trigger: 'change' }],
  password2: [{ validator: validatePassword2, trigger: 'change' }],
})

// 注册功能
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      XWLRequest.post({ url: '/user/register', data: { username: formData.username, password: formData.password } })
        .then(res => {
          let result = res.data
          if (result.status) {
            ElMessage({
              message: '注册成功！！！',
              type: 'success',
            })

            router.replace("/login")
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

const jumpLogin = () => {
  router.replace("/login")
}
</script>