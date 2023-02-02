<template>
  <div class="upload">
    <el-input v-model="inputVal" placeholder="请输入文件名~" />
    <el-select style="margin-left: 10px;" v-model="selectVal" placeholder="请选择用户~">
      <el-option v-for="item in options" :key="item.id" :label="item.username" :value="item.id" />
    </el-select>

    <input type="file" id="file" style="display: none;" :accept="props.accept" multiple>
    <el-button style="margin-left: 10px;" type="primary" @click="upload">上传</el-button>
  </div>
  <progress value="0" max="100" style="display: none;"></progress>
</template>

<script setup>
import { onMounted, ref, defineEmits, defineProps } from 'vue'
import mainStore from '../pinia/mainStore'
import SparkMD5 from 'spark-md5'
import XWLRequest from "../servise/index";
import axios from 'axios';
import { baseURL } from "../constant/index"

const props = defineProps(['accept'])
const emit = defineEmits(["againRequest"])

const inputVal = ref('')
const selectVal = ref('')
const options = ref([])

// 功能：同步获取hash值、切片上传、精度条
let upload2
const upload = () => {
  if (!selectVal.value || !inputVal.value) {
    ElMessage.error("文件名或用户名不能为空~")
    return
  }
  upload2();
}

onMounted(() => {
  const fileEL = document.querySelector("#file");
  const progressEL = document.querySelector("progress");
  upload2 = () => {
    fileEL.click();
  }

  fileEL.addEventListener("change", () => {
    let fileInfos = Array.from(fileEL.files);

    // 限制个数
    if (fileInfos.length > 3) {
      showNotify("数量不能超过3个~");
      fileInfos = []
      return
    }

    let fileSize = fileInfos[0].size;
    let progressVal = 0;

    progressEL.style.display = "block";

    fileInfos.forEach((fileInfo) => {
      const suffix = fileInfo.type.split("/")[1];
      const type = fileInfo.type;

      console.log("1、文件读取~");
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileInfo);

      fileReader.onload = async (e) => {
        console.log("2、获取hash值~");
        const hash = getHash(e.target.result);

        console.log("3、开始切片~");
        let size = 5 * 1024 * 1024; // 切片大小5M
        if (fileInfo.size / size > 100) {
          size = Math.ceil(fileInfo.size / 100);
        }

        let fileChunks = [];
        let index = 0; //切片序号
        for (let cur = 0; cur < fileInfo.size; cur += size) {
          fileChunks.push({
            hash: `${hash}_${index}`,
            chunk: fileInfo.slice(cur, cur + size),
          });
          index++;
        }

        // 获取已上传切片数组（断点续传）
        try {
          const { data: fileSliceArr } = await XWLRequest.get({ url: "/file/getFileSlice", params: { hash, suffix } });

          // 排除已经上传的（断点续传）
          fileChunks = fileChunks.filter((item) => {
            return !fileSliceArr.includes(item.hash);
          });
        } catch (err) {
          console.log("获取已上传切片失败的原因：" + err.response.data);
        }

        // 遍历上传每一片
        console.log("4、上传切片~");
        let promiseArr = [];

        // 进度条-一个或多个文件时赋不同的max值
        if (fileInfos.length === 1) {
          progressEL.max = fileChunks.length;
        } else {
          progressEL.max = fileInfos.length;
        }

        fileChunks.forEach((fileChunk) => {
          let formData = new FormData();
          formData.append("file", fileChunk.chunk);
          formData.append("hash", fileChunk.hash);
          formData.append("suffix", suffix);

          promiseArr.push(
            axios
              .post(`${baseURL}/file/uploadFileSlice?token=${mainStore().userInfo.token}`, formData).then((res) => {
                // 进度条-控制一个文件时
                if (fileInfos.length === 1) {
                  progressVal += 1;
                  progressEL.value = progressVal;
                }
              })
              .catch((err) => {
                console.log("切片上传失败的原因：" + err.response.data);
              })
          );
        });

        Promise.all(promiseArr)
          .then((res) => {
            // 进度条-一个或多个文件时
            if (fileInfos.length > 1) {
              progressVal += 1;
              progressEL.value = progressVal;
            }

            // 合并切片
            let fileName = inputVal.value;
            XWLRequest.get({ url: `/file/mergeFile?user_id=${selectVal.value}`, params: { hash, fileName, suffix, type, len: index, fileSize } }).then((res) => {
              inputVal.value = ''
              selectVal.value = ''
              if (
                progressEL.value === progressEL.max ||
                fileChunks.length === 0
              ) {
                console.log("5、上传切片成功~");
                progressEL.value = 0;
                progressEL.max = 100;
                progressEL.style.display = "none";
              }

              // 刷新页面
              emit('againRequest')
              console.log(res.data.file);
            })
              .catch((err) => {
                console.log("合并切片失败的原因：" + err.response.data);
              });
          })
          .catch((err) => {
            console.log("5、上传失败~");
          });
      };
    });
  });

  function getHash(file) {
    const spart = new SparkMD5.ArrayBuffer();
    spart.append(file);
    const hash = spart.end();

    return hash;
  }
})


// 获取全部用户
const getUsers = async (limit = 5000, offset = 0) => {
  const res = await XWLRequest.get({ url: '/user/getUsers', params: { limit, offset } })
  const res2 = await XWLRequest.get({ url: '/user/getUserById', params: { user_id: 1 } })

  if (!res.data.status) {
    ElMessage.error(res.data.message)
    return
  }

  options.value = [...res2.data.message, ...res.data.message]
}
getUsers()
</script>

<style lang="less" scoped>
.upload {
  display: flex;
}

progress {
  display: block !important;
  margin: 0 0 5px 10px;
}
</style>