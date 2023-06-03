<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="120px">
      <el-form-item label="物流查询key">
        <div>
          <el-input v-model="form.ship" placeholder="物流查询key" >
          </el-input>
          <small class="text-gray-500">
            用于查询物流信息， 接口申请（仅供参考）
          </small>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="handleSubmit"
          >保存</el-button
        ></el-form-item
      >
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { getSysconfig, setSysconfig } from "~/api/sysconfig";
import { toast } from "~/composables/util";

const loading = ref(false);
const form = reactive({
  ship: "",
});
function getData() {
  loading.value = true;
  getSysconfig()
    .then((res) => {
      console.log(res);
      form.ship = res.ship;
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
const handleSubmit = () => {
  loading.value = true;
  setSysconfig({ ...form })
    .then((res) => {
      toast("修改成功", "success");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
