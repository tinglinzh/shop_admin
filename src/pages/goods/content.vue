<template>
  <FormDialog
    style="height: 500px; margin-top: 8vh"
    width="900px"
    ref="formDialogRef"
    title="设置商品详情"
    @submit="handleSubmit()"
  >
    <el-form :model="form" label-width="0px">
      <el-form-item><Editor v-model="form.content" /> </el-form-item>
    </el-form>
  </FormDialog>
</template>
<script setup>
import { readGoods, updateGoodsMessage } from "~/api/goods.js";
import { ref, reactive } from "vue";
import FormDialog from "~/components/FormDialog.vue";
import { toast } from "~/composables/util";
import Editor from "~/components/Editor.vue";

const formDialogRef = ref(null);
const form = reactive({
  content: "",
});

const emit = defineEmits(["reloadData"]);
const goodsId = ref(0);
const openDialog = (row) => {
  goodsId.value = row.id;
  row.contentLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.content = res.content;
      formDialogRef.value.open();
    })
    .finally(() => {
      row.contentLoading = false;
    });
};

const handleSubmit = () => {
  formDialogRef.value.showLoading();
  updateGoodsMessage(goodsId.value, form)
    .then((res) => {
      toast("设置商品详情成功", "success");
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
