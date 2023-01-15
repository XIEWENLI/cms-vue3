<template>
  <div class="register">
    <Form />
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
</style>