<template>
  <div class="echarts">
    <div ref="divEl" class="divEl"></div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import * as echarts from 'echarts';

import { option } from "./echarts.config"
import XWLRequest from "../../../servise/index"

const divEl = ref(null)

const rq1 = XWLRequest.get({ url: '/common/getStatus', params: { fieldName: "numberOfUsers" } })
const rq2 = XWLRequest.get({ url: '/common/getStatus', params: { fieldName: "memory" } })

Promise.all([rq1, rq2]).then(res => {
  if (!res[0].data.status) {
    ElMessage.error(res[0].data.message)
    return
  }

  option.series[0].data[0] = res[0].data.message.numberOfUsers
  option.series[0].data[1] = res[1].data.message.memory
  var myChart = echarts.init(divEl.value);
  myChart.setOption(option);
}).catch(err => {
  console.log(err);
})

</script>

<style lang="less" scoped>
.echarts {
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 10px 0;
}

.divEl {

  height: 600px;
}
</style>