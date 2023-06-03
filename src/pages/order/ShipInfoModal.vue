<template>
  <el-dialog
    destroy-on-close
    title="物流信息"
    v-model="dialogVisable"
    size="40%"
    style="height: 480px; margin-top: 11vh"
  >
    <el-card class="border-0" shadow="never">
      <div class="flex items-center">
        <el-image
          :src="info.logo"
          fit="fill"
          style="width: 60px; height: 60px"
          class="rounded border"
          :lazy="true"
        ></el-image>
        <div class="ml-3">
          <p>物流公司：{{ info.typename }}</p>
          <p>物流公司：{{ info.number }}</p>
        </div>
      </div>
    </el-card>
    <div class="info_body">
      <el-card shadow="never" class="border-0 border-t">
        <el-timeline class="ml-[-40px]">
          <el-timeline-item
            v-for="(item, id) in info.list"
            :key="id"
            :timestamp="item.time"
            placement="top"
          >
            {{ item.status }}
          </el-timeline-item></el-timeline
        >
      </el-card>
    </div>
  </el-dialog>
</template>

<script setup>
import { toast } from "~/composables/util.js";
import { ref } from "vue";
import { getShipInfo } from "~/api/order";

const dialogVisable = ref(false);
const info = ref({});
const open = (id) => {
  return getShipInfo(id).then((res) => {
    if (res.status != 0) {
      return toast(res.msg, "error");
    }
    info.value = res.result;
    console.log(res.result);
    dialogVisable.value = true;
  });
};
defineExpose({
  open,
});
</script>
<style scoped>
.info_body {
  overflow-y: auto;
  height: 300px;
}
</style>
