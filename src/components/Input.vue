<template>
  <div class="input">
    <el-input v-model="inputVal" :placeholder="props.placeholderVal" clearable />
    <el-button style="margin-left: 10px;" type="primary" @click="search">搜索</el-button>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, defineExpose } from 'vue'

const props = defineProps(["placeholderVal"])
const emit = defineEmits(["search"])

const inputVal = ref('')
const search = () => {
  inputVal.value = inputVal.value.trim()
  emit('search', inputVal.value)
}

</script>

<style lang="less" scoped>
.input {
  width: 30%;
  padding-top: 10px;
  padding-left: 10px;
  display: flex;
}
</style>