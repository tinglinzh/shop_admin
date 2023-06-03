<template>
  <FormDialog ref="formDialogRef" title="设置轮播图" @submit="handleSubmit()">
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图" class="mt-10">
        <ChooseImage :limit="9" v-model="form.banners" />
      </el-form-item>
    </el-form>
  </FormDialog>
</template>
<script setup>
import { readGoods, setGoodsBanner } from "~/api/goods.js";
import { ref, reactive } from "vue";
import FormDialog from "~/components/FormDialog.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import { toast } from "~/composables/util";
const formDialogRef = ref(null);
const form = reactive({
  banners: [],
});

const emit = defineEmits(["reloadData"]);
const goodsId = ref(0);
const openDialog = (row) => {
  goodsId.value = row.id;
  row.bannersLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.banners = res.goodsBanner.map((o) => o.url);
      formDialogRef.value.open();
    })
    .finally(() => {
      row.bannersLoading = false;
    });
};

const handleSubmit = () => {
  formDialogRef.value.showLoading();
  setGoodsBanner(goodsId.value, form)
    .then((res) => {
      toast("设置轮播图成功", "success");
      emit("reloadData");
    })
    .finally(() => {
      formDialogRef.value.close();
      formDialogRef.value.hideLoading();
    });
};

// 导出方法
defineExpose({ openDialog });
</script>
