<template>
  <div class="register">
    <div style="margin-top: -5%;">
      <h1>注册界面</h1>
      <Form />
    </div>
  </div>
</template>

<script setup>
import Form from "./cpn/Form.vue"

</script>

<style lang="less" scoped>
.register {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white !important;
  background: url("../../assets/img/login-bg.svg");
  display: flex;
  justify-content: center;
  align-items: center;
}

.register div {
  width: 450px;
}

.register div h1 {
  text-align: center;
  padding-bottom: 5%;
}
</style>